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
  return prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });
}

export function getUserByEmail(email: string) {
  return prisma.user.findUnique({
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
            User1: true,
          },
        },
      },
    })
    .then((value) => value.Friends.map((friendPair) => friendPair.User1));
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

export function createGroup(
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

  return prisma.group.create({
    data: groupWithCreator,
  });
}

export function createExpense(expense: Prisma.ExpenseCreateInput) {
  prisma.expense.create({
    data: expense,
  });
}

export function createFriend(userId: number, friendId: number) {
  return prisma.friendPair.createMany({
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
  });
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

export function updateUser(user: User) {
  return prisma.user.update({
    where: {
      id: user.id,
    },
    data: user,
  });
}

export function updateGroup(group: Group) {
  return prisma.group.update({
    where: {
      id: group.id,
    },
    data: group,
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
