// Fallback content used by the About page + home sections until the admin
// fills in the Profile from the dashboard. Keeps the site looking complete.
export const profileDefaults = {
    name: 'Rizwan Khan',
    title: 'MERN Stack Developer',
    tagline: 'I build scalable, high-performance web applications for the future.',
    bio:
        "Hello! I'm Rizwan Khan, a passionate MERN Stack Developer based in India. " +
        'I specialize in creating interactive, accessible, and high-performance web applications. ' +
        'With a strong foundation in JavaScript and modern frameworks, I love turning complex problems ' +
        'into simple, elegant solutions.',
    photoUrl: '',
    location: 'Remote / India',
    email: 'rizwankhanbara@gmail.com',
    phone: '+91 8009030734',
    available: true,
    socials: {
        github: 'https://github.com/Rizwan-Khan-2002',
        linkedin: 'https://www.linkedin.com/in/rizwankhan8756',
        twitter: '',
        whatsapp: 'https://wa.me/918009030734',
        website: 'https://rizwankhan-portfolio.vercel.app',
    },
    stats: {
        experienceYears: '3+',
        projectsCompleted: '20+',
        happyClients: '15+',
    },
    education: [
        {
            degree: 'Bachelor of Computer Applications (BCA)',
            institution: 'Add your college name',
            period: '2020 — 2023',
            description: 'Foundation in computer science, programming and web technologies.',
        },
    ],
    experience: [
        {
            role: 'MERN Stack Developer',
            company: 'Freelance / Projects',
            period: '2023 — Present',
            description:
                'Building full-stack web applications with React, Node.js, Express and MongoDB.',
        },
    ],
    skills: [
        { name: 'React.js', level: 90 },
        { name: 'Node.js', level: 85 },
        { name: 'MongoDB', level: 80 },
        { name: 'JavaScript', level: 95 },
        { name: 'Express.js', level: 85 },
        { name: 'Tailwind CSS', level: 90 },
        { name: 'Framer Motion', level: 85 },
        { name: 'Git & GitHub', level: 85 },
    ],
};

// Merge a (possibly partial / null) API profile over the defaults so the UI
// always has every field. Empty arrays from the API fall back to defaults.
export const mergeProfile = (apiProfile) => {
    if (!apiProfile) return profileDefaults;
    const p = { ...profileDefaults, ...apiProfile };
    p.socials = { ...profileDefaults.socials, ...(apiProfile.socials || {}) };
    p.stats = { ...profileDefaults.stats, ...(apiProfile.stats || {}) };
    p.education = apiProfile.education?.length ? apiProfile.education : profileDefaults.education;
    p.experience = apiProfile.experience?.length ? apiProfile.experience : profileDefaults.experience;
    p.skills = apiProfile.skills?.length ? apiProfile.skills : profileDefaults.skills;
    return p;
};
