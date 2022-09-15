import ArrowBack from "@mui/icons-material/ArrowBack";
import { Box, List, IconButton } from "@mui/material";
import { grey } from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import TransactionItem from "../../../components/TransactionItem";

const FriendDetailsPage = () => {
  const router = useRouter();
  const { friendId } = router.query;

  return (
    <Box sx={{ minHeight: "100vh", p: 3 }} bgcolor="background.paper">
      <Box sx={{ ml: -1.5, width: "100%", justifyContent: "flex-start" }}>
        <IconButton onClick={() => router.back()}>
          <ArrowBack fontSize="large" />
        </IconButton>
      </Box>
      {/* <TopAppBarNew title="Balance" /> */}
      <Typography variant="caption" sx={{ color: grey[400] }}>
        Transaction between A
      </Typography>
      <Typography variant="h4" sx={{ color: "primary.main", fontWeight: 500 }}>
        +$1,243.00
      </Typography>
      <Typography
        variant="h6"
        sx={{ color: "primary.main", fontWeight: 500, mt: 3 }}
      >
        Transaction
      </Typography>
      <List>
        <TransactionItem /> <TransactionItem />
        <TransactionItem />
      </List>
    </Box>
  );
};

export default FriendDetailsPage;
function AddFriendItem() {
  throw new Error("Function not implemented.");
}
