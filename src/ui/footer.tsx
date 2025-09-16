export default function Footer()
{
    return (
        <div className="flex w-full relative flex-col flex-wrap items-start pb-10">
            <footer className="absolute bottom w-[100%] flex flex-col space-y-1 items-center">
                <p>Developed by <a href="https://dimitrievski.dev" className="hover:bg-primary hover:text-amber-50" rel="author" target="_blank">Riste Dimitrievski</a></p>
                <p>Copyright &copy;2025.All rights reserved</p>
            </footer>
        </div>
    )
}
