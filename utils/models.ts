import { UserInclude } from "./../node_modules/.prisma/client/index.d";
import {
  Prisma,
  PrismaClient,
  type OauthToken,
  type User,
  type Group,
  Expense,
  Split,
} from "@prisma/client";
export { type OauthToken, type User, type Group, type Expense };
const prisma = new PrismaClient();

export function getFriendPairExpenses(
  payerId: number,
  userOwingMoneyId: number
) {
  return prisma.friendPair
    .findUnique({
      where: {
        user1Id_user2Id: {
          user1Id: payerId,
          user2Id: userOwingMoneyId,
        },
      },
      include: {
        Expenses: true,
      },
    })
    .then((value) => value?.Expenses);
}

export function getUserById(id: number) {
  return prisma.user.findFirstOrThrow({
    where: {
      id,
    },
  });
}

export function getUserByEmail(email: string) {
  return prisma.user.findFirst({
    where: {
      email,
    },
  });
}

export function getUserByEmailFuzzySearch(input: string, userId: number) {
  return prisma.user.findMany({
    where: {
      AND: [
        {
          OR: [
            {
              email: {
                contains: input,
              },
            },
            {
              name: {
                contains: input,
              },
            },
          ],
        },
        {
          NOT: {
            Friends: {
              some: {
                user2Id: userId,
              },
            },
          },
        },
      ],
    },
  });
}

export function findUsersAddForGroup(
  input: string,
  userId: number,
  groupId: number
) {
  return prisma.user.findMany({
    where: {
      AND: [
        {
          OR: [
            {
              email: {
                contains: input,
              },
            },
            {
              name: {
                contains: input,
              },
            },
          ],
        },
        {
          NOT: {
            // id: userId,
            Groups: {
              some: {
                id: groupId,
              },
            },
          },
        },
      ],
    },
  });
}

export function getSplitsByGroup(groupId: number, userId: number) {
  return prisma.split
    .findMany({
      where: {
        Expense: {
          groupId: groupId,
        },
        userId: userId,
      },
    })
    .then((value) => value);
}

export function getSplitsByExpense(expenseId: number, groupId: number) {
  return prisma.split.findMany({
    where: {
      expenseId: expenseId,
      Expense: {
        groupId: groupId,
      },
    },
    include: {
      User: true,
      Expense: {
        include: {
          Payer: true,
        },
      },
    },
  });
}

export function getPaymentsFromGroup(groupId: number, userId: number) {
  return prisma.payment.findMany({
    where: {
      groupId: groupId,
      paidFromId: userId,
    },
  });
}

export function getFriendsList(userId: number) {
  return prisma.user
    .findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        Friends: {
          include: {
            User2: true,
          },
        },
      },
    })
    .then((value) => value.Friends.map((friendPair) => friendPair.User2));
}

export function getAllFriendWithExpensesDetails(userId: number) {
  /*
        "amount": figure,
        "user": {
            "id": 3,
            "name": "test",
            "email": "test@test.com",
            ...
        }
  */

  return getFriendsList(userId).then((friends) => {
    return prisma.friendExpense
      .groupBy({
        by: ["payerId", "userOwingMoneyId"],
        where: {
          OR: [
            {
              payerId: userId,
            },
            {
              userOwingMoneyId: userId,
            },
          ],
        },
        _sum: {
          amount: true,
        },
      })
      .then((value) => {
        const friendExpenses = value.map((friendExpense) => {
          return {
            _sum: {
              amount:
                friendExpense.payerId == userId
                  ? friendExpense._sum!.amount
                  : -friendExpense._sum!.amount,
            },
            friend: friends.find(
              (friend) =>
                friend.id ===
                (friendExpense.payerId == userId
                  ? friendExpense.userOwingMoneyId
                  : friendExpense.payerId)
            ),
          };
        });
        let result = friends.reduce(
          (acc, curr) => (
            (acc[curr.id] = {
              amount: 0,
              user: curr,
            }),
            acc
          ),
          {}
        );
        friendExpenses.reduce((res, value) => {
          result[value!.friend.id].amount += value._sum.amount;
        });
        return Object.keys(result).map((x) => {
          return { amount: result[x].amount, user: result[x].user };
        });
      });
  });
}

export function getFriendDetails(userId: number, friendId: number) {
  const friend = getUserById(friendId);
  const friendExpenses = getFriendPairExpenses(friendId, userId);
  const userExpenses = getFriendPairExpenses(userId, friendId);
  const commonGroups = prisma.group.findMany({
    where: {
      AND: [
        {
          Users: {
            some: {
              id: userId,
            },
          },
        },
        {
          Users: {
            some: {
              id: friendId,
            },
          },
        },
      ],
    },
  });

  return {
    friend,
    userExpenses,
    friendExpenses,
    commonGroups,
  };
}

interface GroupListElement {}

export async function getGroupsList(userId: number) {
  // aim: for each group, get all splits belonging to user

  // aim: for each group, get all payments made by user
  // const paymentsGroupedByGroup = await prisma.payment.groupBy({
  //   where: {
  //     paidFromId: userId,
  //   },
  //   by: ["groupId"],
  //   _sum: {
  //     amount: true,
  //   },
  // });

  // const groups = await prisma.group.findMany({
  //   where: {
  //     Users: {
  //       some: {
  //         id: userId,
  //       },
  //     },
  //   },
  //   include: {
  //     Payment: true,
  //   },
  // });

  // Note _UsersGroups.A references Group
  // _UsersGroups.B references User
  // A better way to do this is to explicitly create the join table.

  const paymentsAndSplitsGroupedByGroup = (await prisma.$queryRaw`
  SELECT Group.id, Group.name, SUM(Payment.amount), SUM(Split.amount) FROM Group, _UsersGroups, Payment, Expense, Split 
  WHERE Group.id = _UsersGroups.A AND _UsersGroups.B = ${userId} AND Payment.groupId = Group.id
  AND Expense.groupId = Group.id AND Split.expenseId = Expense.id AND Split.userId = ${userId}
  GROUP BY Group.id`) as any;
  console.log(paymentsAndSplitsGroupedByGroup);
  return paymentsAndSplitsGroupedByGroup;
}

export function getGroupDetails(groupId: number) {
  return prisma.group.findUnique({
    where: {
      id: groupId,
    },
    include: {
      Expenses: true,
      Payment: {
        include: {
          PaidFrom: true,
        },
      },
      Users: true,
    },
  });
}

export async function getGroupSummaries(userId: number) {
  // return prisma.$queryRaw`
  // SELECT "Group"."id" FROM "public"."Group"`;
  // return prisma.$queryRaw`
  // SELECT Group."id", Group."name", SUM(Payment."amount"), SUM(Split."amount") FROM "public"."Group", "public"."_UsersGroups", "public"."Payment", "public"."Expense", "public"."Split"
  // WHERE Group."id" = UsersGroups."A" AND UsersGroups."B" = ${userId} AND Payment."groupId" = Group."id"
  // AND Expense."groupId" = Group."id" AND Split."expenseId" = Expense."id" AND Split."userId" = ${userId}
  // GROUP BY Group."id"`;
  return prisma.$queryRaw`
  SELECT * FROM (SELECT "Group"."id", "Group"."name", coalesce(SUM("test"."amount"), 0) as Payment
  -- , coalesce(SUM("Split"."amount"), 0) as Split 
  FROM "public"."Group" JOIN "public"."_UsersGroups"
  ON "Group"."id" = "public"."_UsersGroups"."A" AND "public"."_UsersGroups"."B" = ${userId} 
  -- INNER JOIN (SELECT * FROM "public"."Expense") "expense" ON "expense"."groupId" = "Group"."id"
  -- JOIN "public"."Split" ON "Split"."expenseId" = "expense"."id" AND "Split"."userId" = ${userId}
  INNER JOIN (SELECT * FROM "public"."Payment" WHERE "public"."Payment"."paidFromId" = ${userId}) "test" ON "test"."groupId" = "Group"."id" 
  GROUP BY "Group"."id") "A" JOIN
  (SELECT "Group"."id", "Group"."name", coalesce(SUM("Split"."amount"), 0) as Split 
  FROM "public"."Group" JOIN "public"."_UsersGroups"
  ON "Group"."id" = "public"."_UsersGroups"."A" AND "public"."_UsersGroups"."B" = ${userId} 
  INNER JOIN (SELECT * FROM "public"."Expense") "expense" ON "expense"."groupId" = "Group"."id"
  JOIN "public"."Split" ON "Split"."expenseId" = "expense"."id" AND "Split"."userId" = ${userId}
  -- INNER JOIN (SELECT * FROM "public"."Payment" WHERE "public"."Payment"."paidFromId" = ${userId}) "test" ON "test"."groupId" = "Group"."id" 
  GROUP BY "Group"."id") "B" ON "A"."id" = "B"."id"`;
}

export function getUserProfile(userId: number) {
  return getUserById(userId);
}

export function getTokenByUser(userId: number) {
  return prisma.user
    .findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        OauthToken: true,
      },
    })
    .then((user) => user?.OauthToken);
}

export function getActivities(userId: number) {
  return prisma.activity.findMany({
    where: {
      userId,
    },
  });
}

export function createToken(token: Prisma.OauthTokenCreateInput) {
  return prisma.oauthToken.create({
    data: token,
  });
}

export function createUser(user: Prisma.UserCreateInput) {
  return prisma.user.create({
    data: user,
  });
}

// export function createSplit(user: Prisma.SplitCreateInput) {
//   return prisma.split.create({
//     data: user,
//   });
// }

export async function createSplits(splits: Split[]) {
  const promises = splits.map((split) => {
    const splitInput: Prisma.SplitCreateInput = {
      amount: split.amount,
      Expense: {
        connect: {
          id: split.expenseId,
        },
      },
      User: {
        connect: {
          id: split.userId,
        },
      },
    };
    return prisma.split.create({
      data: splitInput,
    });
  });
  const res = await Promise.all(promises);
  return res;
}

export async function createGroup(
  group: Prisma.GroupCreateInput,
  initialUserId: number
) {
  const groupWithCreator: Prisma.GroupCreateInput = {
    ...group,
    Users: {
      connect: [
        {
          id: initialUserId,
        },
      ],
    },
  };

  const createdGroup = await prisma.group.create({
    data: groupWithCreator,
  });

  await prisma.activity.create({
    data: {
      userId: initialUserId,
      type: "createGroup",
      groupId: createdGroup.id,
      description: "Created a group!",
    },
  });

  return createdGroup;
}

export function createNewExpense(
  group: Prisma.ExpenseCreateInput,
  groupId: number,
  payerId: number
) {
  const expense: Prisma.ExpenseCreateInput = {
    ...group,
    Group: {
      connect: {
        id: groupId,
      },
    },
    Payer: {
      connect: {
        id: payerId,
      },
    },
    timestamp: new Date(),
  };

  return prisma.expense.create({
    data: expense,
  });
}

// creatorUserId should be equal to expense.Payer.id, but I decided to be explicit here.
export async function createExpense(
  expense: Prisma.ExpenseCreateInput,
  creatorUserId: number
) {
  const createdExpense = await prisma.expense.create({
    data: expense,
  });

  await prisma.activity.create({
    data: {
      type: "createExpense",
      userId: creatorUserId,
      description: "Created an expense!",
      expenseId: createdExpense.id,
    },
  });

  return createdExpense;
}

export async function createFriend(userId: number, friendId: number) {
  const count = (
    await prisma.friendPair.createMany({
      data: [
        {
          user1Id: userId,
          user2Id: friendId,
        },
        {
          user1Id: friendId,
          user2Id: userId,
        },
      ],
      skipDuplicates: true,
    })
  ).count;
  if (count > 0) {
    await prisma.activity.create({
      data: {
        userId,
        type: "createFriend",
        friendId,
        description: "Made a friend!",
      },
    });
  }
}

export function createFriendExpense(
  amount: number,
  userId: number,
  friendId: number
) {
  return prisma.friendExpense.create({
    data: {
      amount,
      payerId: userId,
      userOwingMoneyId: friendId,
    },
  });
}

export async function updateUser(user: User) {
  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: user,
  });

  await prisma.activity.create({
    data: {
      userId: user.id,
      type: "updateUser",
      description: "Updated your profile!",
    },
  });

  return updatedUser;
}

export async function inviteUserToGroup(groupId: number, newUserId: number) {
  const updatedGroup = await prisma.group.update({
    where: {
      id: groupId,
    },
    data: {
      Users: {
        connect: {
          id: newUserId,
        },
      },
    },
  });

  return updatedGroup;
}

export async function removeUserFromGroup(groupId: number, userId: number) {
  const updatedGroup = await prisma.group.update({
    where: {
      id: groupId,
    },
    data: {
      Users: {
        disconnect: {
          id: userId,
        },
      },
    },
  });

  return updatedGroup;
}
// Precondition: The user is a member of the group.
export async function updateGroup(group: Group, updaterUserId: number) {
  const updatedGroup = await prisma.group.update({
    where: {
      id: group.id,
    },
    data: group,
  });

  await prisma.activity.create({
    data: {
      userId: updaterUserId,
      type: "updateGroup",
      description: `Updated the group ${group.name}!`,
      groupId: updatedGroup.id,
    },
  });

  return updatedGroup;
}

// Precondition: leaver is in group
export async function leaveGroup(groupId: number, leaverUserId: number) {
  const updatedGroup = await prisma.group.update({
    where: {
      id: groupId,
    },
    data: {
      Users: {
        disconnect: {
          id: leaverUserId,
        },
      },
    },
  });

  await prisma.activity.create({
    data: {
      userId: leaverUserId,
      type: "leaveGroup",
      description: `Left the group ${updatedGroup.name}`,
      groupId,
    },
  });
}

export async function updateSplit(splits: Split[]) {
  const promises = splits.map((split) =>
    prisma.split.update({
      where: {
        id: split.id,
      },
      data: {
        amount: split.amount,
      },
    })
  );
  const res = await Promise.all(promises);
  return res;
}

export function updateToken(oauthToken: OauthToken) {
  return prisma.oauthToken.update({
    where: {
      id: oauthToken.id,
    },
    data: oauthToken,
  });
}

export async function deleteFriend(userId: number, friendId: number) {
  const { count } = await prisma.friendPair.deleteMany({
    where: {
      OR: [
        { user1Id: userId, user2Id: friendId },
        { user1Id: friendId, user2Id: userId },
      ],
    },
  });

  const friend = await getUserById(friendId);

  if (count > 0) {
    await prisma.activity.create({
      data: {
        userId,
        type: "deleteFriend",
        friendId,
        description: `Said goodbye to ${friend.name}`,
      },
    });
  }
}

// Precondition: The deleter is a member of the group.
export async function deleteGroup(groupId: number, deleterUserId: number) {
  const deletedGroup = await prisma.group.delete({
    where: {
      id: groupId,
    },
  });

  await prisma.activity.create({
    data: {
      type: "deleteGroup",
      userId: deleterUserId,
      description: `Deleted the group ${deletedGroup.name}`,
    },
  });
}
