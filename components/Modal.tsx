import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import { grey } from "@mui/material/colors";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

type PropsType = {
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
}: PropsType) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="modal">
        <Grid className="modal__content">
          <Grid item xs>
            <Typography variant="h6" component="h2" className="modal__title">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body1" className="modal__subtitle">
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
