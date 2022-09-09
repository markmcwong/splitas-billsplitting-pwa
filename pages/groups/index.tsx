import React, { useState, useEffect } from "react";
import { type PostBody } from "../api/user/groups";
import * as models from "../../utils/models";
import * as url from "../../utils/url";

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

    setName(""); // a hack to force re-render
  }

  return (
    <>
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
    </>
  );
}
