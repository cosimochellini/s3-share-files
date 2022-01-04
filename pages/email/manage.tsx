import { useState } from "react";
import List from "@mui/material/List";
import Grid from "@mui/material/Grid";
import { Divider } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import ListItem from "@mui/material/ListItem";
import { Email, Star } from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItemText from "@mui/material/ListItemText";
import { UserEmail } from "../../src/types/dynamo.types";
import { functions } from "../../src/instances/functions";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { notification } from "../../src/instances/notification";
import { NewUserEmail } from "../../src/components/Form/NewUserEmail";
import { useUserEmail } from "../../src/hooks/state/useUserEmail.state";
import { LoadingButton } from "../../src/components/Data/LoadingButton";
import { FilesPlaceholders } from "../../src/components/Placeholders/FilesPlaceholders";

export default function Manage() {
  const { emails, refreshEmails } = useUserEmail();
  const [indexActive, setIndexActive] = useState(-1);

  const deleteEmail = (email: UserEmail) =>
    functions.email
      .deleteEmail(email)
      .then(() => refreshEmails())
      .catch(notification.error);

  return (
    <>
      <h1>Manage Email</h1>
      <Grid container>
        <Grid item xs={12} sm={6}>
          <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
            Your emails
          </Typography>
          <Divider />
          <List>
            {!emails?.length ? (
              <FilesPlaceholders count={3} />
            ) : (
              emails.map((email, i) => (
                <div key={email.pk}>
                  <ListItem
                    selected={indexActive === i}
                    onMouseEnter={() => setIndexActive(i)}
                    secondaryAction={
                      <LoadingButton
                        type={"icon"}
                        icon={<DeleteIcon />}
                        clickAction={() => deleteEmail(email)}
                        iconProps={{
                          color: "error",
                          sx: { borderRadius: 2, border: 1 },
                        }}
                      />
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        {email.default ? <Star color="warning" /> : <Email />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      secondary={email.email}
                      primary={email.description}
                    />
                  </ListItem>
                  <Divider />
                </div>
              ))
            )}
          </List>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
            Add new email
          </Typography>
          <NewUserEmail />
        </Grid>
      </Grid>
    </>
  );
}