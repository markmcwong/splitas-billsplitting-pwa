import { Search, Check, Add } from "@mui/icons-material";
import {
  TextField,
  InputAdornment,
  ListItem,
  ListItemIcon,
  Box,
  Typography,
  IconButton,
  Switch,
  Button,
} from "@mui/material";
import { deleteFriend } from "../utils/models";
import ModalContent from "./Modal";
import * as models from "../utils/models";
import * as url from "../utils/urls";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Stack from "@mui/system/Stack";

type Props = {
  handleClose: () => void;
  open: boolean;
  callback: () => void;
  isUsedForGroup: boolean;
  currentUsers?: models.User[];
};

const FriendModal = ({
  handleClose,
  open,
  callback,
  isUsedForGroup,
  currentUsers,
}: Props) => {
  const [friendEmail, setFriendEmail] = useState<string>("");
  const router = useRouter();
  const { groupId } = router.query;
  const [searchByEmail, setSearchByEmail] = useState<boolean>(true);
  const [friendSearchResult, setFriendSearchResult] = useState<
    (models.User & { isFriendAlready: boolean })[]
  >([]);

  useEffect(() => {
    const getData = setTimeout(() => {
      if (friendEmail.length > 0 && searchByEmail) {
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

  useEffect(() => {
    if (!searchByEmail) {
      getContacts();
    }
  }, [searchByEmail]);

  const addFriend = (friendId: number) => {
    fetch(`${url.api}/user/friends?friendId=${friendId}`, {
      method: "POST",
    })
      .then((res) => {
        res.json();
      })
      .then((data) => {
        callback();
        handleClose();
      });
  };

  const deleteFriend = (friendId: number) => {
    fetch(`${url.api}/user/friends/${friendId}?friendId=${friendId}`, {
      method: "DELETE",
    }).then((res) => {
      callback();
    });
  };

  const addFriendByContact = (friendEmail: string) => {
    fetch(`${url.api}/user/friends?friendEmail=${friendEmail}`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        const res = friendSearchResult.map((x) => {
          return {
            ...x,
            id: friendEmail === x.email ? data.userId : null,
            isFriendAlready: friendEmail == x.email ? true : x.isFriendAlready,
          };
        });
        setFriendSearchResult(res);
        callback();
      });
  };

  const getContacts = () => {
    fetch(`${url.api}/user/contacts`, {})
      .then((res) => res.json())
      .then((data) => {
        setFriendSearchResult(
          data.map((x: { emailAddress: string; name: string }) => {
            const i = currentUsers
              ? currentUsers!.findIndex((e) => e.email == x.emailAddress)
              : -1;
            if (i > -1) console.log(x);
            return {
              ...x,
              email: x.emailAddress,
              isFriendAlready: i > -1,
              id: i > -1 ? currentUsers![i].id : null,
            };
          })
        );
      });
  };

  useEffect(() => {
    console.log(friendSearchResult);
  }, [friendSearchResult]);

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
    <ModalContent
      open={open}
      handleClose={() => {
        handleClose();
        setFriendEmail("");
        setSearchByEmail(true);
      }}
      title="Add new friends"
    >
      <>
        <Stack
          direction="row"
          sx={{ mt: 2, maxWidth: "100%" }}
          spacing={2}
          alignItems="center"
        >
          <TextField
            sx={{
              flex: 1,
              borderRadius: 15,
              input: { color: "background.default" },
            }}
            // fullWidth
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
            size="small"
            style={{ color: "black" }}
          />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{ px: 1 }}
          >
            <Typography color="primary.main" variant="body2">
              Email
            </Typography>
            <Switch
              value={searchByEmail}
              onChange={() => {
                setFriendSearchResult([]);
                setSearchByEmail(!searchByEmail);
              }}
              sx={{ ml: 0 }}
            />
            <Typography color="primary.main" variant="body2">
              Contacts
            </Typography>
          </Stack>
          {/* <Button
            sx={{ flex: "0 0 35%" }}
            variant="contained"
            onClick={() => {
              setFriendSearchResult([]);
              setSearchByEmail(!searchByEmail);
            }}
          >
            <Typography color="white" variant="body2">
              {"By Email"}
            </Typography>
          </Button> */}
        </Stack>
        <Box overflow="scroll">
          {friendSearchResult!
            .filter(
              (x) =>
                searchByEmail ||
                x.name.toLowerCase().includes(friendEmail.toLowerCase()) ||
                x.email.toLowerCase().includes(friendEmail.toLowerCase())
            )
            .map((user, i) => (
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
                    if (searchByEmail) {
                      if (friendSearchResult[i].isFriendAlready) {
                        isUsedForGroup
                          ? addToGroup(user.id, false)
                          : deleteFriend(user.id);
                      } else {
                        isUsedForGroup
                          ? addToGroup(user.id, true)
                          : addFriend(user.id);
                      }
                    } else {
                      friendSearchResult[i].isFriendAlready
                        ? deleteFriend(user.id)
                        : addFriendByContact(user.email);
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
        </Box>
      </>
    </ModalContent>
  );
};

export default FriendModal;
