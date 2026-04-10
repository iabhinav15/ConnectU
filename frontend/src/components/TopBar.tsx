import React, { useEffect } from "react";
import { TbSocial } from "react-icons/tb";
import { Link } from "react-router-dom";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";
import { useForm } from "react-hook-form";
import { BsMoon, BsSunFill } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { SetTheme } from "../redux/theme";
import { Logout } from "../redux/userSlice";
import { fetchPosts } from "../utils";
import { useDebounce } from "../hooks/useDebounce";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

const TopBar = () => {
    const { theme } = useAppSelector((state) => state.theme);
    const { user } = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const {
        register,
        handleSubmit,
        watch,
    } = useForm();
    
    const handleTheme = () => {
        const themeValue = theme === "light" ? "dark" : "light";
        dispatch(SetTheme(themeValue));
    };

    const handleSearch = async (data: any) => {
        if(user && user.token) {
            await fetchPosts(user.token, dispatch, "", data);
        }
    };

    const debouncedSearch = useDebounce(
        () => handleSearch({ search: watch("search") }),
        700
    );

    const searchValue = watch("search");

    useEffect(() => {
        debouncedSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchValue]);

    return (
        <div className="topbar w-full flex items-center justify-between py-3 md:py-6 px-4 bg-primary">
            <Link to="/" className="flex gap-2 items-center">
                <div className="p-1 md:p-2 bg-[#065ad8] rounded text-white">
                    <TbSocial />
                </div>
                <div className="text-xl md:text-2xl text-[#065ad8] font-semibold">
                    ConnectU
                </div>
            </Link>

            <form
                className="hidden md:flex items-center justify-center"
                onSubmit={handleSubmit(handleSearch)}
            >
                <TextInput
                    placeholder="search..."
                    styles="w-[18rem] lg:w-[38rem] rounded-l-full py-3"
                    register={register("search")}
                />

                <CustomButton
                    title="search"
                    type="submit"
                    containerStyles="bg-[#0444a4] text-white px-6 py-2.5 mt-2 rounded-r-full"
                />
            </form>
            {/* {ICONS} */}
            <div className="flex gap-4 items-center text-ascent-1 text-md md:text-xl ">
                <button onClick={() => handleTheme()}>
                    {theme === "light" ? <BsMoon /> : <BsSunFill />}
                </button>
                <div className="hidden lg:flex">
                    <IoMdNotificationsOutline />
                </div>
                <div>
                    <CustomButton
                        onClick={() => dispatch(Logout())}
                        title="Log Out"
                        containerStyles="text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full"
                    />
                </div>
            </div>
        </div>
    );
};

export default TopBar;
