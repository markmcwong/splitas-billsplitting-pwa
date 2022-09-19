import Box from "@mui/material/Box";
import grey from "@mui/material/colors/grey";
import Typography from "@mui/material/Typography";

const MoneyLabel = (dollar: number, labelEnabled: boolean = false) => {
  const cents = parseInt((dollar % 1).toFixed(2).substring(2));
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        sx={{ textAlign: "end" }}
      >
        <Typography
          variant="h6"
          sx={{
            color: dollar < 0 ? "error.main" : "primary.main",
            display: "inline-block",
          }}
        >
          ${Math.abs(dollar).toFixed(0)}
        </Typography>
        {cents != 0 && (
          <Typography
            variant="body2"
            sx={{ color: "primary.main", display: "inline-block" }}
          >
            .{cents}
          </Typography>
        )}
      </Box>
      {labelEnabled && (
        <Typography variant="body2" sx={{ color: grey[400], mt: -1 }}>
          {dollar < 0 ? "owed" : "lent"}
        </Typography>
      )}
    </Box>
  );
};

export default MoneyLabel;
