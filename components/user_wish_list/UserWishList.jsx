"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUserWishes } from "@/lib/redux/slices/wishSlice";
import Image from "next/image";

import classes from "./UserWishList.module.scss";
import UserWishCard from "./UserWishCard";

const UserWishList = ({ lng }) => {
  const dispatch = useDispatch();
  const { userWishes } = useSelector((state) => state.rootReducer.wish);

  useEffect(() => {
    dispatch(getAllUserWishes());
  }, [])

  console.log(userWishes);

  return (
    <div className={classes["user-wish-list-container"]}>
      <header>
        <Image
          src="/IMGS/user-wish-list.jpg"
          alt="A mix of the 2 principal colors of the website: Purple and orange"
          width={4000}
          height={4000}
        />

        <h1>Wish list</h1>
      </header>

      <section className={classes["user-wish-list-section"]}>
        {userWishes && userWishes.map((userWish, i) => {
          return(
            <UserWishCard key={`${userWish.slug}${i}`} userWish={userWish} lng={lng} />
        )})}
      </section>
    </div>
  )
}

export default UserWishList
