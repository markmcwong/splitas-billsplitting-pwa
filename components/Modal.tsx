import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import { grey } from "@mui/material/colors";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

type Props = {
  open: boolean;
  handleClose: () => void;
  title: string;
  subtitle?: string;
  children?: JSX.Element;
  rightContent?: JSX.Element | null;
};

const ModalContent = ({
  open,
  handleClose,
  title,
  subtitle,
  children,
  rightContent,
}: Props) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="modal--centered">
        <Grid sx={{ mb: 1 }} flexDirection="row" display="flex">
          <Grid item xs>
            <Typography variant="h6" component="h2" color="background.default">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body1" color={grey[400]} sx={{ pb: 1 }}>
                {subtitle}
              </Typography>
            )}
          </Grid>
          <Grid item xs={5}>
            {rightContent}
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Grid>
        </Grid>
        <Divider />
        {children}
      </Box>
    </Modal>
  );
};

export default ModalContent;
