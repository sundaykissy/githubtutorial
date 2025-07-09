import type { ThemeConfig } from "antd";

const antTheme: ThemeConfig = {
  token: {
    colorPrimary: "red", // Purple
    borderRadius: 6,
    fontSize: 15,
  },
  components: {
    Button: {
      borderRadius: 10,
    },
    Input: {
      colorBorder: "#673ab7",
    },
  },
};

export default antTheme;
