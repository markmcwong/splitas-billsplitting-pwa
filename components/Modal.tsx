import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

type Props = {
  open: boolean;
  handleClose: () => void;
  title: string;
  children?: JSX.Element;
};

const ModalContent = ({ open, handleClose, title, children }: Props) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="modal-centered">
        <Typography variant="h6" component="h2" color="background.default">
          {title}
        </Typography>
        <Divider />
        {children}
      </Box>
    </Modal>
  );
};

export default ModalContent;
