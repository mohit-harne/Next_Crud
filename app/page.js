import NavBar from "@/app/components/NavBar";
import Image from "next/image";

export default function Home() {
  return (
    <main className="p-5 md:p-10 mt-[0px] min-h-screen">
      <div className="mt-10 max-w-3xl mx-auto bg-white/75 shadow-lg rounded-lg p-6 md:p-8 border-4 border-orange-400">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
          Welcome to our CRUD Application
        </h3>
        <p className="text-sm md:text-base text-gray-700 mb-4">
          Built using <span className="font-semibold">Next.js</span>, <span className="font-semibold">MongoDB</span>, and <span className="font-semibold">Redux</span>, this application provides a seamless user experience for managing user data. 
        </p>
        <p className="text-sm md:text-base text-gray-700 mb-4">
          With a modern interface designed with <span className="font-semibold">Tailwind CSS</span>, navigating through the app is both intuitive and visually appealing.
        </p>
        <p className="text-sm md:text-base text-gray-700 mb-4">
          To explore the user listing, simply click on the <span className="font-semibold">Users</span> menu in the navigation bar. This section allows you to view, add, edit, and delete users effortlessly. Each user entry displays relevant information, making it easy to manage your user base.
        </p>
        <p className="text-sm md:text-base text-gray-700 mb-4">
          Whether you are an administrator or simply looking to keep track of users, this application offers powerful CRUD functionalities at your fingertips. Dive in and start managing your users today!
        </p>
      </div>
    </main>
  );
}
