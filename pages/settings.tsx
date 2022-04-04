import { forwardRef, useEffect } from "react";
import GlobalThemes from "../src/themes/index";
import { useAuth } from "../src/hooks/auth.hook";
import { settings } from "../src/instances/settings";
import { formatter } from "../src/formatters/formatter";
import { useDarkMode } from "../src/hooks/darkMode.hook";
import { useCurrentContext } from "../src/hooks/context.hook";
import { navbarItems, Visibility } from "../src/instances/navbar";
import { Checkbox, FormControlLabel } from "../src/barrel/mui.barrel";
import { Grid, ListItem, ListItemIcon } from "../src/barrel/mui.barrel";
import { ListItemText, Divider, Link, List } from "../src/barrel/mui.barrel";

export default function Settings() {
  const { session } = useAuth();
  const context = useCurrentContext();
  const [darkMode, setDarkMode] = useDarkMode();

  useEffect(() => {
    context.setTheme(darkMode ? GlobalThemes.dark : GlobalThemes.light);
  }, [context, darkMode]);

  return (
    <>
      <h1>Settings</h1>
      <Grid
        alignItems="center"
        justifyContent="center"
        sx={{ maxWidth: { xs: "100%", sm: "90%", md: "80%" } }}
      >
        <List>
          <Divider />
          {navbarItems
            .filter(({ visibility }) => Visibility.Sidebar === visibility)
            .map(({ name, redirect, icon }) => (
              <div key={name}>
                <ListItem
                  button
                  component={forwardRef(function Component(prop, ref) {
                    return <Link key={name} href={redirect} {...prop} />;
                  })}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={name} />
                </ListItem>
                <Divider />
              </div>
            ))}
        </List>
      </Grid>

      <FormControlLabel
        label="Dark Mode"
        control={
          <Checkbox
            onChange={(e) => setDarkMode(e.target.checked)}
            checked={darkMode}
          />
        }
      />
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={12}>
          <p>version: {settings.version}</p>
          <p>email: {session?.user?.email}</p>
          <p> expire: {formatter.dateFormatter(session?.expires)} </p>
        </Grid>
      </Grid>
    </>
  );
}
