import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Search, Filter, TrendingUp, Users, Zap } from 'lucide-react';
import api from '../services/api';
import { mockDomains, mockRoles } from '../data/mockCareer';

export default function CareerExplorerPage() {
	const [domains, setDomains] = useState(mockDomains); // Start with mock data
	const [roles, setRoles] = useState(mockRoles); // Start with mock data
	const [loading, setLoading] = useState(false); // Start with false since we have mock data
	const [selectedDomain, setSelectedDomain] = useState('');
	const [query, setQuery] = useState('');
	const [apiLoaded, setApiLoaded] = useState(false);
	const navigate = useNavigate();
	const hasToastedRef = useRef(false);

	useEffect(() => {
		// Load API data in background without blocking UI
		(async () => {
			try {
				const [dRes, rRes] = await Promise.all([
					api.get('/careers/domains'),
					api.get('/careers/roles')
				]);
				// Only update if we got real data
				if (dRes.data && dRes.data.length > 0) {
					setDomains(dRes.data);
				}
				if (rRes.data && rRes.data.length > 0) {
					setRoles(rRes.data);
					setApiLoaded(true);
					if (!hasToastedRef.current) {
						hasToastedRef.current = true;
						toast('Loaded live career data', { icon: '✅' });
					}
				}
			} catch (e) {
				// API offline → keep using mock data (no toast needed since we start with mock)
				console.log('API offline, using mock data');
			}
		})();
	}, []);

	const filter = async (domain, q) => {
		setLoading(true);
		try {
			if (apiLoaded) {
				// Use API if available
				const res = await api.get('/careers/roles', { params: { domain: domain || undefined, q: q || undefined } });
				setRoles(res.data || []);
			} else {
				// Use client-side filtering with current data
				const base = roles;
				const needle = (q || '').toLowerCase();
				const filtered = base.filter(r =>
					(!domain || r.domain === domain) &&
					(!needle || (r.title + r.domain + (r.lead || '') + (r.description || '')).toLowerCase().includes(needle))
				);
				setRoles(filtered);
			}
		} catch (e) {
			// Fallback to client-side filtering
			const base = roles;
			const needle = (q || '').toLowerCase();
			const filtered = base.filter(r =>
				(!domain || r.domain === domain) &&
				(!needle || (r.title + r.domain + (r.lead || '') + (r.description || '')).toLowerCase().includes(needle))
			);
			setRoles(filtered);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
			{/* Header Section */}
			<div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="text-center animate-fade-in">
						<h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
							Explore Career Paths
						</h1>
						<p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-2">
							Discover high-demand roles, core skills, and typical salary ranges in the engineering world.
						</p>
						<div className="flex items-center justify-center gap-2">
							<div className={`w-2 h-2 rounded-full ${apiLoaded ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
							<span className="text-sm text-gray-500 dark:text-gray-400">
								{apiLoaded ? 'Live data' : 'Demo data'}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Search and Filter Section */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
					<div className="flex flex-col lg:flex-row gap-4">
						<div className="flex-1 relative">
							<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
							<input 
								value={query} 
								onChange={e => setQuery(e.target.value)} 
								onKeyDown={e => e.key === 'Enter' && filter(selectedDomain, e.target.value)} 
								placeholder="Search roles, skills, or keywords..." 
								className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300" 
							/>
						</div>
						<div className="flex gap-3">
							<select 
								value={selectedDomain} 
								onChange={e => { setSelectedDomain(e.target.value); filter(e.target.value, query); }} 
								className="px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
							>
								<option value="">All Domains</option>
								{domains.map(d => (<option key={d} value={d}>{d}</option>))}
							</select>
							<button 
								onClick={() => filter(selectedDomain, query)} 
								className="btn-primary flex items-center gap-2"
							>
								<Filter className="w-4 h-4" />
								Filter
							</button>
						</div>
					</div>
				</div>

				{/* Stats Section */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
						<div className="flex items-center">
							<div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
								<TrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Roles</p>
								<p className="text-2xl font-bold text-gray-900 dark:text-white">{roles.length}</p>
							</div>
						</div>
					</div>
					<div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
						<div className="flex items-center">
							<div className="p-3 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg">
								<Users className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">Domains</p>
								<p className="text-2xl font-bold text-gray-900 dark:text-white">{domains.length}</p>
							</div>
						</div>
					</div>
					<div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
						<div className="flex items-center">
							<div className="p-3 bg-success-100 dark:bg-success-900/30 rounded-lg">
								<Zap className="w-6 h-6 text-success-600 dark:text-success-400" />
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">High Demand</p>
								<p className="text-2xl font-bold text-gray-900 dark:text-white">
									{roles.filter(r => r.demandIndex > 70).length}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Roles Grid */}
				{loading ? (
					<div className="flex justify-center items-center py-20">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{roles.map((role, index) => (
							<div 
								key={role._id} 
								className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover-card animate-slide-up"
								style={{ animationDelay: `${index * 0.1}s` }}
							>
								<div className="h-32 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 relative">
									{role.isFeatured && (
										<div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
											Featured
										</div>
									)}
								</div>
								<div className="p-6">
									<div className="flex items-center justify-between mb-3">
										<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
											{role.domain}
										</span>
										<div className="flex items-center text-sm text-gray-500">
											<TrendingUp className="w-4 h-4 mr-1" />
											{role.demandIndex}
										</div>
									</div>
									<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
										{role.title}
									</h3>
									<p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
										{role.lead || role.description}
									</p>
									<div className="flex items-center justify-between">
										<div className="text-sm text-gray-500">
											{role.salaryBands?.[0] && (
												<span>
													${role.salaryBands[0].min.toLocaleString()} - ${role.salaryBands[0].max.toLocaleString()}
												</span>
											)}
										</div>
										<button 
											onClick={() => navigate(`/careers/roles/${role._id}`)} 
											className="btn-outline text-sm"
										>
											View Details
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}

				{/* Empty State */}
				{!loading && roles.length === 0 && (
					<div className="text-center py-20">
						<div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
							<Search className="w-12 h-12 text-gray-400" />
						</div>
						<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
							No careers found
						</h3>
						<p className="text-gray-600 dark:text-gray-300">
							Try adjusting your search criteria or browse all domains.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}


