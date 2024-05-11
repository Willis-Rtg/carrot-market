export default function Home() {
  return (
    <main className="bg-gray-300 h-screen flex flex-col gap-10 items-center justify-center p-10 dark:bg-gray-800">
      <div className="bg-white shadow-lg w-96 p-5 rounded-2xl dark:bg-gray-600">
        <div>
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="text-gray-600 -mb-1 dark:text-gray-400">
                In transit
              </span>
              <span className="text-4xl font-semibold dark:text-white">
                Coolblue
              </span>
            </div>
            <div className="bg-orange-400 size-12 rounded-full"></div>
          </div>
          <div className="my-2 flex items-center gap-2">
            <span className="uppercase bg-green-400 px-3 py-1.5 text-white rounded-3xl transition hover:scale-110 hover:bg-green-500">
              Today
            </span>
            <span className="dark:text-gray-100">9:30~10:30</span>
          </div>
          <div className="relative my-1 mt-2.5 ">
            <div className="bg-gray-200 w-full h-2 rounded-full" />
            <div className="top-0 absolute bg-green-400 w-2/3 h-2 rounded-full" />
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-100">
            <span>Expected</span>
            <span>Sorting center</span>
            <span>In transit</span>
            <span className="text-gray-500">Delivered</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 bg-white shadow-lg max-w-screen-lg w-full md:flex-row p-5 rounded-2xl dark:bg-gray-600 *:outline-none has-[:invalid]:bg-red-300 transition-colors">
        <input
          placeholder="Search here..."
          className="w-full bg-gray-300 rounded-full placeholder:drop-shadow pl-4 h-10 ring ring-transparent ring-offset-gray-600 ring-offset-2 hover:ring-orange-400 transition-shadow peer"
          type="email"
          required
        />
        <span className="text-red-400 pl-4 -mt-2 hidden peer-invalid:block">
          Eamil is required
        </span>
        <button className="bg-black text-white w-full md:max-w-52 rounded-full py-1 active:scale-95 transition-transform  bg-gradient-to-tr from-purple-300 to-rose-500">
          Search
        </button>
      </div>
      <div className="flex flex-col bg-white shadow-lg max-w-screen-lg w-full p-10 rounded-lg ">
        {["willis", "Me", "You", "the other", ""].map((person, index) => (
          <div
            key={index}
            className="flex items-center gap-4 rounded-xl p-2.5 border-b-2 last:border-0 [&>*:nth-child(n+4)]:animate-pulse group"
          >
            <div className="size-10 bg-cyan-400 rounded-full" />
            <span className="empty:bg-slate-300 empty:h-3 empty:w-16 empty:rounded-2xl empty:animate-pulse group-hover:text-red-100">
              {person}
            </span>
            <div className="relative text-white bg-red-400 rounded-full size-8 flex justify-center items-center ">
              <span>{index}</span>
              <div className="absolute bg-red-400 rounded-full size-8 animate-ping" />
            </div>
            <div className="size-10 bg-slate-400 rounded-full" />
            <div className="w-40 h-3 rounded-full bg-slate-400" />
            <div className="w-20 h-3 rounded-full bg-slate-400" />
          </div>
        ))}
      </div>
    </main>
  );
}
