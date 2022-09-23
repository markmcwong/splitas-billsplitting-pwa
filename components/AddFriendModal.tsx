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
  Grid,
  Avatar,
} from "@mui/material";
import { deleteFriend } from "../utils/models";
import ModalContent from "./Modal";
import * as models from "../utils/models";
import * as url from "../utils/urls";
import * as oauth from "../utils/oauth";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Stack from "@mui/system/Stack";

/* type definition starts */

type PropsType = {
  handleClose: () => void;
  open: boolean;
  callback: () => void;
  isUsedForGroup: boolean;
  currentUsers?: models.User[];
};

type friendSearchResultType = {
  id: number | null;
  hasAccount: boolean;
  name: string;
  email: string;
  photo: string | null;
  isFriendAlready: boolean;
};

/* type definition ends */

const FriendModal = ({
  handleClose,
  open,
  callback,
  isUsedForGroup,
  currentUsers,
}: PropsType) => {
  /* Lifecycle hooks starts */
  const [friendEmail, setFriendEmail] = useState<string>("");
  const router = useRouter();
  const { groupId } = router.query;
  const [searchByEmail, setSearchByEmail] = useState<boolean>(true);
  const [friendSearchResult, setFriendSearchResult] = useState<
    friendSearchResultType[]
  >([]);
  const stateRef = useRef<null | boolean>();

  useEffect(() => {
    stateRef!.current = searchByEmail;
  }, []);

  useEffect(() => {
    /* timeout to prevent too many requests */
    const getData = setTimeout(() => {
      if (friendEmail.length > 0 && searchByEmail) {
        fetch(
          `${url.api}/user/friends/search?friendEmail=${friendEmail}&isForGroup=${isUsedForGroup}&groupId=${groupId}`
        )
          .then((res) => {
            if (res.ok) return res.json();
            return Promise.reject(res);
          })
          .then((data) => {
            setFriendSearchResult(
              data.map((x: models.User) => {
                return { ...x, isFriendAlready: false };
              })
            );
          });
      }
    }, 500);

    return () => {
      clearTimeout(getData);
    };
  }, [friendEmail, searchByEmail]);

  useEffect(() => {
    stateRef!.current = searchByEmail;
    if (!searchByEmail) {
      getContacts();
    } else {
      setFriendSearchResult([]);
    }
  }, [searchByEmail]);

  /* Lifecycle hooks ends */

  /* network functions starts */

  const addFriend = (friendId: number) => {
    fetch(`${url.api}/user/friends?friendId=${friendId}`, {
      method: "POST",
    })
      .then((res) => {
        if (res.ok) return res.json();
        return Promise.reject(res);
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
      .then((res) => {
        if (res.ok) return res.json();
        return Promise.reject(res);
      })
      .then((data) => {
        const res = friendSearchResult.map((x: friendSearchResultType) => {
          return {
            ...x,
            id: friendEmail === x.email ? data.userId : null,
            hasAccount: true,
            isFriendAlready: friendEmail == x.email ? true : x.isFriendAlready,
          };
        });
        setFriendSearchResult(res);
        callback();
      });
  };

  const getContacts = () => {
    fetch(`${url.api}/user/contacts`, {})
      .then((res) => {
        if (res.ok) return res.json();
        return Promise.reject(res);
      })
      .then((data) => {
        console.log(stateRef.current);
        if (!stateRef.current) {
          setFriendSearchResult(
            data.map((x: oauth.ContactInfo) => {
              const userIdx = currentUsers
                ? currentUsers!.findIndex((e) => e.email == x.emailAddress)
                : -1;
              return {
                ...x,
                photo: x.photo,
                email: x.emailAddress,
                isFriendAlready: userIdx > -1,
                id: userIdx > -1 ? currentUsers![userIdx].id : null,
              };
            })
          );
        }
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

  /* network functions ends */

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
        <Grid className="model-friend__form-controls">
          <Grid item xs={12}>
            <TextField
              className="form__input--no-margin"
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
            />
          </Grid>
          {!isUsedForGroup && (
            <Grid item xs={12}>
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
                  className="form__switch"
                />
                <Typography color="primary.main" variant="body2">
                  Contacts
                </Typography>
              </Stack>
            </Grid>
          )}
        </Grid>
        <Box className="model-friend__list">
          {friendSearchResult!
            .filter(
              (x) =>
                searchByEmail ||
                x.name.toLowerCase().includes(friendEmail.toLowerCase()) ||
                x.email.toLowerCase().includes(friendEmail.toLowerCase())
            )
            .map((user, i) => (
              <ListItem className="modal-friend__list-item">
                <Avatar src={user.photo ?? ""} sx={{ mr: 1 }}></Avatar>
                <ListItemIcon className="container--flex-1">
                  <Box className="container--column">
                    <Typography variant="h6" color="text.primary">
                      {user.name.length > 16
                        ? user.name.substring(0, 13) + "..."
                        : user.name}
                    </Typography>
                    <Typography
                      color="text.primary"
                      width="100%"
                      textAlign="end"
                    >
                      {user.email.length > 21
                        ? user.email.substring(0, 18) + "..."
                        : user.email}
                    </Typography>
                  </Box>
                </ListItemIcon>
                <IconButton
                  onClick={() => {
                    if (searchByEmail) {
                      if (friendSearchResult[i].isFriendAlready) {
                        isUsedForGroup
                          ? addToGroup(user.id!, false)
                          : deleteFriend(user.id!);
                      } else {
                        isUsedForGroup
                          ? addToGroup(user.id!, true)
                          : addFriend(user.id!);
                      }
                    } else {
                      friendSearchResult[i].isFriendAlready
                        ? deleteFriend(user.id!)
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
