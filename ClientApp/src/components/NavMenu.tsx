import React, { useState } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

export function NavMenu() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <header>
      <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" container light>
        <NavbarBrand tag={Link} to="/">FullstackReactDemo</NavbarBrand>
        <NavbarToggler onClick={() => setCollapsed(!collapsed)} className="mr-2" />
        <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!collapsed} navbar>
          <ul className="navbar-nav flex-grow">
            <NavItem>
              <NavLink tag={Link} className="text-dark" to="/">Search</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} className="text-dark" to="/manage-users">Manage Users</NavLink>
            </NavItem>
          </ul>
        </Collapse>
      </Navbar>
    </header>
  );
}
