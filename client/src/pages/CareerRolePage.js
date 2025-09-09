import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { mockRoles } from '../data/mockCareer';
import BackBar from '../components/BackBar';

export default function CareerRolePage() {
	const { id } = useParams();
	const [role, setRole] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const res = await api.get(`/careers/roles/${id}`);
				setRole(res.data);
			} catch (e) {
				const demo = mockRoles.find(r => r._id === id);
				if (demo) {
					setRole({
						...demo,
						responsibilities: [
							'Work with cross-functional teams to design solutions',
							'Implement robust, scalable systems and pipelines',
							'Monitor performance and iterate on improvements'
						],
						skills: (demo.skills || []).map(s => ({ name: s, level: 'intermediate' })),
						salaryBands: (demo.salaryBands || []).map(b => ({ region: b.region || b.location || 'Global', currency: b.currency || '$', min: b.min, max: b.max }))
					});
					toast('Showing demo role (API offline)', { icon: 'ℹ️' });
				} else {
					toast.error('Role not found');
				}
			} finally {
				setLoading(false);
			}
		})();
	}, [id]);

	if (loading) return <div className="max-w-5xl mx-auto px-4 py-10 text-gray-500">Loading...</div>;
	if (!role) return null;

	return (
		<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<BackBar title="Career Role" />
			{/* Meta row */}
			<div className="mb-6 flex items-center gap-3 text-sm">
				<span className="inline-flex items-center rounded-full bg-primary-100 text-primary-700 px-3 py-1 font-medium">{role.domain}</span>
				<span className="text-gray-500">•</span>
				<span className="text-gray-500">Demand index: {role.demandIndex}</span>
			</div>

			<h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
				{role.title}
			</h1>
			<p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl">{role.lead || role.description}</p>

			{/* Cover visual */}
			<div className="mt-8 mb-10 aspect-[16/9] w-full rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-dark-800 dark:to-dark-700 border border-gray-200 dark:border-dark-700" />

			<article className="prose prose-lg dark:prose-invert max-w-none">
				<h3>What you’ll work on</h3>
				<ul>
					{(role.responsibilities || []).map((r, idx) => <li key={idx}>{r}</li>)}
				</ul>

				<h3>Core skills</h3>
				<ul>
					{(role.skills || []).map((s, idx) => <li key={idx}><strong>{s.name}</strong> — {s.level}</li>)}
				</ul>

				<h3>Salary overview</h3>
				<p>Typical salary bands by region:</p>
				<ul>
					{(role.salaryBands || []).map((b, idx) => (
						<li key={idx}>{b.region}: {b.currency} {b.min.toLocaleString()} - {b.max.toLocaleString()}</li>
					))}
				</ul>

				<hr />
				<p className="text-sm text-gray-500">Layout inspired by clean, content-first article pages.</p>
			</article>

			{/* Related roles */}
			{(role.relatedRoles && role.relatedRoles.length > 0) && (
				<section className="mt-12">
					<h4 className="text-xl font-semibold mb-6">Related roles</h4>
					<div className="flex flex-wrap gap-2">
						{role.relatedRoles.map((rr, idx) => (
							<span key={idx} className="inline-flex items-center rounded-full bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-200 px-3 py-1 text-sm">{rr}</span>
						))}
					</div>
				</section>
			)}
		</div>
	);
}


