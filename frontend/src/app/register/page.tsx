import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React from "react";

function page() {
  return (
    <div className="h-screen flex justify-center items-center ">
      <div className="w-[550px] bg-white rounded-xl px-10 py-10 shadow-md">
        <h1 className="text-4xl text-center font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
          CareerFlow
        </h1>
        <h1 className="text-3xl font-bold my-2">Register</h1>
        <p>Welcome to CareerFlow</p>
        <form>
        <div className="mt-4 flex flex-col gap-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="name"
              name="name"
              placeholder="Enter your name.."
            />
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email.."
            />
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password.."
            />
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <Label htmlFor="cpassword">Confirm Password</Label>
            <Input
              id="cpassword"
              type="password"
              name="confirm_password"
              placeholder="Confirm your password.."
            />
          </div>
          <div className="mt-4">
            <Button className="w-full">Submit</Button>
          </div>
        </form>
        <p className="text-center mt-2">
            Already have and account ?{" "}
            <strong>
                <Link href="login">Login</Link>
            </strong>
        </p>
      </div>
    </div>
  );
}

export default page;
