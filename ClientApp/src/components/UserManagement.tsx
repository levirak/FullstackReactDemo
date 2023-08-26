import React, { useState, useEffect } from 'react';
import './UserManagement.css';

type UserModel = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}


type UserRowProps = {
  user: UserModel,
  onSave(user: UserModel): Promise<void>,
  onDelete(id: string): Promise<void>,
}

function UserRow(props: UserRowProps) {
  const [edit, setEdit] = useState(false);

  const { id } = props.user;
  const [firstName, setFirstName] = useState(props.user.firstName);
  const [lastName, setLastName] = useState(props.user.lastName);
  const [email, setEmail] = useState(props.user.email);

  if (edit) {
    function onSave() {
      setEdit(false);
      props.onSave({id, firstName, lastName, email});
    }

    function onDelete() {
      setEdit(false);
      props.onDelete(id);
    }

    return <>
      <td>
        <input
          type='text'
          value={firstName}
          onChange={event => setFirstName(event.target.value)}
        />
      </td>
      <td>
        <input
          type='text'
          value={lastName}
          onChange={event => setLastName(event.target.value)}
        />
      </td>
      <td>
        <input
          type='email'
          value={email}
          onChange={event => setEmail(event.target.value)}
        />
      </td>
      <td className='button-box'>
        <button type='button' onClick={onSave}>Save</button>
        <button type='button' onClick={onDelete}>Delete</button>
      </td>
    </>;
  }
  else {
    return <>
      <td>{firstName}</td>
      <td>{lastName}</td>
      <td>{email}</td>
      <td className='button-box'>
        <button type='button' onClick={() => setEdit(true)}>
          Edit
        </button>
      </td>
    </>;
  }
}


type NewUserRowProps = {
  onSave(user: UserModel): Promise<void>,
}

function NewUserRow(props: NewUserRowProps) {
  const [edit, setEdit] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  if (edit) {
    function reset() {
      setFirstName('');
      setLastName('');
      setEmail('');
    }

    function onSave() {
      setEdit(false);
      props.onSave({
        id: '00000000-0000-0000-0000-000000000000',
        firstName,
        lastName,
        email,
      }).then(reset);
    }

    function onCancel() {
      setEdit(false);
      reset();
    }

    return <>
      <td>
        <input
          type='text'
          value={firstName}
          onChange={event => setFirstName(event.target.value)}
        />
      </td>
      <td>
        <input
          type='text'
          value={lastName}
          onChange={event => setLastName(event.target.value)}
        />
      </td>
      <td>
        <input
          type='email'
          value={email}
          onChange={event => setEmail(event.target.value)}
        />
      </td>
      <td className='button-box'>
        <button type='button' onClick={onSave}>Save</button>
        <button type='button' onClick={onCancel}>Cancel</button>
      </td>
    </>;
  }
  else {
    return <>
      <td />
      <td />
      <td />
      <td className='button-box'>
        <button type='button' onClick={() => setEdit(true)}>
          New
        </button>
      </td>
    </>;
  }
}


async function getUsers() {
  // TODO(levirak): error handling
  const result = await fetch('api/v1/users');
  return await result.json() as unknown as UserModel[];
}

export function UserManagement() {
  const [users, setUsers] = useState<UserModel[]|null>(null);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  async function doUpdate(user: UserModel) {
    await fetch(`api/v1/users/${user.id}`, { method: 'PUT', body: JSON.stringify(user) });
    setUsers(await getUsers());
  };

  async function doDelete(id: string) {
    await fetch(`api/v1/users/${id}`, { method: 'Delete' });
    setUsers(await getUsers());
  };

  async function doCreate(user: UserModel) {
    await fetch('api/v1/users', { method: 'POST', body: JSON.stringify(user) });
    setUsers(await getUsers());
  };

  return (
    <div>
      <h1>Manage Users</h1>
      {
        !users
          ? <p>Loading...</p>
          : <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {
                users.map((it, idx) =>
                  <tr className={(idx%2) === 0 ? 'even' : 'odd'}>
                    <UserRow key={it.id}
                      user={it}
                      onSave={doUpdate}
                      onDelete={doDelete}
                    />
                  </tr>
                )
              }
              <tr className={(users.length%2) === 0 ? 'even' : 'odd'}>
                <NewUserRow onSave={doCreate} />
              </tr>
            </tbody>
          </table>
      }
    </div>
  );
}
