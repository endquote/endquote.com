import Link from "next/link";
import { FC } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";

type Props = {
  active?: string;
};

export const Header: FC<Props> = ({ active }) => {
  return (
    <Container>
      <header>
        <Navbar
          bg="white"
          variant="light"
          expand="lg"
          collapseOnSelect={true}
          className="px-0 py-3"
        >
          <Link href="/" passHref={true}>
            <Navbar.Brand>Josh Santangelo</Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Link href="/about" passHref={true}>
                <Nav.Link active={active === "about"}>About</Nav.Link>
              </Link>
              {/* <Link href="/immersive" passHref={true}>
                <Nav.Link active={active === "immersive"}>
                  Immersive
                </Nav.Link>
              </Link> */}
              <Link href="/posts" passHref={true}>
                <Nav.Link active={active === "posts"}>Posts</Nav.Link>
              </Link>
              {/*
              <Link href="/work" passHref={true}>
                <Nav.Link active={active === "work"}>
                  Work
                </Nav.Link>
              </Link>
              */}
              <Link href="/director" passHref={true}>
                <Nav.Link active={active === "director"}>
                  Technical Director
                </Nav.Link>
              </Link>
              <Link href="/engineer" passHref={true}>
                <Nav.Link active={active === "engineer"}>
                  Lead Engineer
                </Nav.Link>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </header>
    </Container>
  );
};
