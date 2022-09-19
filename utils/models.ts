import {
  Prisma,
  PrismaClient,
  type OauthToken,
  type User,
  type Group,
  Expense,
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

export function getGroupsList(userId: number) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      Groups: true,
    },
  });
}

export function getGroupDetails(groupId: number) {
  return prisma.group.findUnique({
    where: {
      id: groupId,
    },
    include: {
      Expenses: true,
      Payment: true,
      Users: true,
    },
  });
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
