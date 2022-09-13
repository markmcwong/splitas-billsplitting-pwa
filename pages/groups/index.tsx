import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import BottomAppBar from "../../components/BottomAppBar";
import TopAppBar from "../../components/AppBar";
import { AppRoutesValues } from "../../utils/urls";
import { type PostBody } from "../api/user/groups";
import * as models from "../../utils/models";
import * as url from "../../utils/urls";

type UserWithGroups = models.User & {
  Groups: models.Group[];
};

export default function GroupsPage() {
  const [userWithGroups, setUserWithGroups] = useState<UserWithGroups | null>(
    null
  );
  const [name, setName] = useState<string>("");

  useEffect(() => {
    fetch(`${url.api}/user/groups`)
      .then((res) => res.json())
      .then((g) => {
        setUserWithGroups(g);
      });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  function submitForm(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    const postBody: PostBody = {
      name,
    };
    fetch(`${url.api}/user/groups`, {
      method: "POST",
      body: JSON.stringify(postBody),
    });
    setTimeout(() => {
      setName(""); // a hack to force re-render
    }, 1000);
  }

  return (
    <Box bgcolor="primary.main">
      <TopAppBar />
      <div>Groups</div>
      <ol>
        {userWithGroups?.Groups?.map((group) => (
          <li key={group.id}>{group.name}</li>
        ))}
      </ol>

      <h5>Create new Group</h5>
      <form>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" value={name} onChange={handleChange} />
        <button type="submit" onClick={submitForm}>
          Create
        </button>
      </form>

      <BottomAppBar routeValue={AppRoutesValues.Groups} />
    </Box>
  );
}
