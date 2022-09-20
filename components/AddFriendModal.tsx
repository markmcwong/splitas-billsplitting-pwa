import { Search, Check, Add } from "@mui/icons-material";
import {
  TextField,
  InputAdornment,
  ListItem,
  ListItemIcon,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { deleteFriend } from "../utils/models";
import ModalContent from "./Modal";
import * as models from "../utils/models";
import * as url from "../utils/urls";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type Props = {
  handleClose: () => void;
  open: boolean;
  callback: () => void;
  isUsedForGroup: boolean;
  // currentUsers?: models.User[];
};

const FriendModal = ({
  handleClose,
  open,
  callback,
  isUsedForGroup,
}: Props) => {
  const [friendEmail, setFriendEmail] = useState<string>("");
  const router = useRouter();
  const { groupId } = router.query;
  const [friendSearchResult, setFriendSearchResult] = useState<
    (models.User & { isFriendAlready: boolean })[]
  >([]);

  useEffect(() => {
    const getData = setTimeout(() => {
      if (friendEmail.length > 0) {
        fetch(
          `${url.api}/user/friends/search?friendEmail=${friendEmail}&isForGroup=${isUsedForGroup}&groupId=${groupId}`
        )
          .then((res) => res.json())
          .then((data) =>
            setFriendSearchResult(
              data.map((x) => {
                return { ...x, isFriendAlready: false };
              })
            )
          );
      }
    }, 500);

    return () => {
      clearTimeout(getData);
    };
  }, [friendEmail]);

  const addFriend = (friendId: number) => {
    fetch(`${url.api}/user/friends?friendId=${friendId}`, {
      method: "POST",
    }).then((res) => {
      callback();
    });
  };

  const deleteFriend = (friendId: number) => {
    fetch(`${url.api}/user/friends/${friendId}?friendId=${friendId}`, {
      method: "DELETE",
    }).then((res) => {
      callback();
    });
  };

  const addToGroup = (userId: number, isInviting: boolean) => {
    const postBody = {
      type: isInviting ? "invite" : "kick",
      userId,
    };
    fetch(`${url.api}/user/groups/${groupId}`, {
      method: "POST",
      body: JSON.stringify(postBody),
    }).then((res) => {
      callback();
    });
  };

  return (
    <ModalContent open={open} handleClose={handleClose} title="Add new friends">
      <>
        <TextField
          sx={{
            flex: "0 0 100%",
            borderRadius: 15,
            mt: 2,
            input: { color: "background.default" },
          }}
          fullWidth
          value={friendEmail}
          onChange={(e) => setFriendEmail(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          id="outlined-basic"
          variant="outlined"
          style={{ color: "black" }}
        />
        {friendSearchResult!.map((user, i) => (
          <ListItem sx={{ ml: 0, pl: 0, display: "flex" }}>
            <ListItemIcon
              sx={{
                display: "flex",
                flex: "0 0 95%",
                borderRadius: 2,
              }}
            >
              <Box display="flex" flexDirection="column">
                <Typography variant="h6" color="text.primary">
                  {user.name.substring(0, 8)}
                </Typography>
                <Typography
                  color="text.primary"
                  width="100%"
                  textAlign="end"
                  onClick={() => {
                    // setIsEditing(
                    //   isEditing.map((_, idx) => (idx == i ? true : _))
                    // );
                  }}
                >
                  {user.email}
                </Typography>
              </Box>
            </ListItemIcon>
            <IconButton
              onClick={() => {
                if (friendSearchResult[i].isFriendAlready) {
                  isUsedForGroup
                    ? addToGroup(user.id, false)
                    : deleteFriend(user.id);
                } else {
                  isUsedForGroup
                    ? addToGroup(user.id, true)
                    : addFriend(user.id);
                }
                let friendsCopy = [...friendSearchResult];
                friendsCopy[i] = {
                  ...friendsCopy[i],
                  isFriendAlready: !friendsCopy[i].isFriendAlready,
                };
                setFriendSearchResult(friendsCopy);
              }}
            >
              {user.isFriendAlready ? <Check /> : <Add />}
            </IconButton>
          </ListItem>
        ))}
      </>
    </ModalContent>
  );
};

export default FriendModal;
