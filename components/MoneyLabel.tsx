import Box from "@mui/material/Box";
import grey from "@mui/material/colors/grey";
import Typography from "@mui/material/Typography";

const MoneyLabel = (
  dollar: number,
  labelEnabled: boolean = false,
  isOffline: boolean = false
) => {
  const cents = parseInt((dollar % 1).toFixed(2).split(".")[1]);
  return (
    <Box className="money-label__container">
      <Box className="money-label__text-container">
        <Typography
          variant="h6"
          sx={{
            color: isOffline
              ? grey[400]
              : dollar < 0
              ? "error.main"
              : "primary.main",
            display: "inline-block",
          }}
        >
          ${Math.abs(dollar).toFixed(2).toString().split(".")[0]}
        </Typography>
        {cents != 0 && (
          <Typography
            variant="body2"
            sx={{
              color: isOffline
                ? grey[400]
                : dollar < 0
                ? "error.main"
                : "primary.main",
              display: "inline-block",
            }}
          >
            .{cents}
          </Typography>
        )}
      </Box>
      {labelEnabled && (
        <Typography variant="body2" className="money-label__status">
          {dollar < 0 ? "owed" : "lent"}
        </Typography>
      )}
    </Box>
  );
};

export default MoneyLabel;
