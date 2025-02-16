"use client";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

import { MenuIcon } from "lucide-react";
import { FullScreenMenu } from "@/components/FullscreenMenu";
import { MENU_ITEMS } from "@/lib/values";

import { LoginLink, useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Button } from "./ui/button";

export const NavBar = () => {
  const { user } = useKindeBrowserClient();

  console.log(user);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex flex-grow sm:justify-center justify-between mt-3 sm:mx-24 xs:mx-4">
      <Link className="hidden sm:flex items-center" href="/">
        <div className="items-center font-semibold">LauBridge</div>
      </Link>
      <div className="sm:flex-grow hidden sm:flex">
        <NavigationMenu className="mx-auto">
          <NavigationMenuList>
            {MENU_ITEMS.map((item) =>
              item.subItems ? (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="flex flex-col p-3 gap-3 w-[300px]">
                      {item.subItems.map((subItem) => (
                        <ListItem
                          key={subItem.title}
                          href={subItem.href}
                          title={subItem.title}
                          icon={subItem.icon}
                        >
                          {subItem.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={item.title}>
                  <Link href={item.href!} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {item.title}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div
        className="flex justify-center items-center sm:hidden ml-3"
        onClick={toggleMenu}
      >
        <MenuIcon />
      </div>
      {isMobileMenuOpen && <FullScreenMenu onClose={toggleMenu} />}
      <Link
        className="sm:hidden top-5 absolute left-1/2 transform -translate-x-1/2"
        href="/"
      >
        <div className="flex sm:hidden">LauBridge</div>
      </Link>

      <div className="flex">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className="justify-end">
              {user ? (
                <Link href="/profil" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Profil
                  </NavigationMenuLink>
                </Link>
              ) : (
                <LoginLink>
                  <Button>Logg inn</Button>
                </LoginLink>
              )}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

type ListItemProps = React.ComponentPropsWithoutRef<"a"> & {
  icon?: React.ReactNode;
  title: string;
};

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(
  ({ className, title, icon, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <div className="flex pl-3 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
            <div className="text-[30px] flex items-center mr-3">
              {icon ? icon : <></>}
            </div>
            <Link href={props.href!} legacyBehavior passHref>
              <a
                ref={ref}
                className={cn(
                  "block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors",
                  className
                )}
                {...props}
              >
                <div className="text-sm font-medium leading-none">{title}</div>
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                  {children}
                </p>
              </a>
            </Link>
          </div>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";
