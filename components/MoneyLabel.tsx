import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const MoneyLabel = (dollar: number, cents: number) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      sx={{ textAlign: "end" }}
    >
      <Typography
        variant="h6"
        sx={{ color: "primary.main", display: "inline-block" }}
      >
        ${dollar}
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "primary.main", display: "inline-block" }}
      >
        .{cents}
      </Typography>
    </Box>
  );
};

export default MoneyLabel;
