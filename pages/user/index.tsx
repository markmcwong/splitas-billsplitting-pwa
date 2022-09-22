import Box from "@mui/material/Box";
import BottomAppBar from "../../components/BottomAppBar";
import TopAppBar from "../../components/AppBar";
import { AppRoutesValues } from "../../utils/urls";
import { useEffect, useState, useContext, useReducer } from "react";
import * as url from "../../utils/urls";
import * as models from "../../utils/models";
import { PwaContext } from "../_app";
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import EditNameDialog from "../../components/EditNameDialog";

const defaultUser: models.User = {
  id: 0,
  hasAccount: false,
  name: "",
  email: "",
  tokenId: null,
};

export default function UserPage() {
  const [user, setUser] = useReducer(
    (s: models.User, a: Partial<models.User>) => ({ ...s, ...a }),
    defaultUser
  );
  const [editNameDialogOpen, setEditNameDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    fetch(`${url.api}/user`)
      .then((resp) => {
        if (resp.ok) {
          return resp.json();
        }
        return Promise.reject(resp);
      })
      .then((u) => setUser(u));
  }, []);

  const handleNameChange = (name: string) => {
    setUser({ name: name });
    fetch(`${url.api}/user`, {
      method: "PUT",
      body: JSON.stringify(user),
    });
  };

  const pwaContext = useContext(PwaContext);

  return (
    <Box bgcolor="background.paper">
      <TopAppBar headerText="Profile" />

      <EditNameDialog
        open={editNameDialogOpen}
        handleClose={() => setEditNameDialogOpen(false)}
        handleSubmit={handleNameChange}
        user={user}
      />

      <Stack spacing={4} sx={{ padding: "2em 0" }}>
        <Stack spacing={0.5}>
          <Box display="flex" justifyContent="center" width="100vw">
            <Avatar
              alt={user?.name ?? ""}
              src=""
              sx={{ width: "40vw", height: "40vw", align: "center" }}
            />
          </Box>
          <Typography flexGrow={1} align="center" variant="h5">
            {user?.name}
            <IconButton
              aria-label="menu"
              onClick={() => setEditNameDialogOpen(true)}
            >
              <EditIcon />
            </IconButton>
          </Typography>
          <Typography flexGrow={1} align="center" color="#424242">
            {user?.email}
          </Typography>
          <div></div>
        </Stack>
        <Divider />
        <Stack spacing={2}>
          {pwaContext?.pwaData?.deferredInstallPrompt && (
            <Typography flexGrow={1} align="center">
              <Button
                variant="contained"
                color="secondary"
                size="large"
                sx={{ width: "66%", borderRadius: "12px" }}
                onClick={(e) =>
                  pwaContext.handleAppInstall(
                    pwaContext.pwaData,
                    pwaContext.setPwaData
                  )
                }
              >
                Install App Locally
              </Button>
            </Typography>
          )}
          <Typography flexGrow={1} align="center">
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{ width: "66%", borderRadius: "12px" }}
            >
              Sign Out
            </Button>
          </Typography>
        </Stack>
      </Stack>

      <BottomAppBar routeValue={AppRoutesValues.Profile} />
    </Box>
  );
}
