import { PrismaClient } from "@prisma/client";
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
  const user = getUserById(userId);
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
    user,
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
