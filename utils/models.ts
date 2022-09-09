import { Prisma, PrismaClient, type User, type Group } from "@prisma/client";
export { type User, type Group };
const prisma = new PrismaClient();

function getUserById(id: number) {
  return prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });
}

export function getFriendsList(userId: number) {
  return prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    include: {
      Friends: true,
    },
  });
}

export function getFriendDetails(userId: number, friendId: number) {
  const friend = getUserById(friendId);
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
    commonGroups,
  };
}

export function getGroupsList(userId: number) {
  return prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    include: {
      Groups: true,
    },
  });
}

export function getGroupDetails(groupId: number) {
  return prisma.group.findUniqueOrThrow({
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

export function createUser(user: User) {
  return prisma.user.create({
    data: user,
  });
}

export function createGroup(group: Group, initialUserId: number) {
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

export function createFriend(userId: number, friendId: number) {
  prisma.friendPair.createMany({
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
