import * as models from "./models";

// Returns group if authorized, else false.
export async function authorizeGroup(userId: number, groupId: number) {
  const group = await models.getGroupDetails(groupId);
  if (
    group === null ||
    group.Users.find((u) => u.id === userId) === undefined
  ) {
    return null;
  }

  return group;
}
