import NavBar from './NavBar.jsx';
import TopBar from './TopBar.jsx';
import Footer from './Footer.jsx';

const DefaultLayout = ({ children }) => (
	<>
		<div className="min-h-screen bg-bg-primary">
			<TopBar />
			<div className="flex">
				<NavBar />
				<main className="min-h-[calc(100vh-64px)] flex-1 px-4 py-5 sm:px-6 lg:px-8">
					{children}
					<Footer />
				</main>
			</div>
		</div>
	</>
);

export default DefaultLayout;
