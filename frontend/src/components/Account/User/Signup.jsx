import { Link } from 'react-router'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner';

import Input from '../../Input'
import auth from '../../../supabase/auth'

function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        role: 'user',
        name: 'annoymous',
        email: '',
        password: ''
    });

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async () => {
        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }
        if (!formData.email) {
            toast.error("Please fill all the fields");
            return;
        }

        const res = await auth.signUp(formData.name || 'Anonymous', formData.email, formData.password);

        if (res.status === 'success') {
            toast.success(res.msg);
            navigate('/login');
        } else {
            toast.error(res.msg);
            console.error(res.error);
        }
    }

    return (
        <div className='flex justify-center'>
            <div className="relative flex flex-col rounded-xl bg-transparent">
                <h1 className="block text-4xl text-center font-semibold text-slate-900">
                    Sign Up
                </h1>

                <div className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                    <div className="mb-1 flex flex-col gap-6">
                        <div className="w-full max-w-sm min-w-[200px]">
                            <Input
                                label="Full Name"
                                type="text"
                                placeholder="Your Full Name"
                                name="name"
                                onChange={(e) => onChange(e)}
                                required
                            />
                        </div>
                        <div className="w-full max-w-sm min-w-[200px]">
                            <Input
                                label="Email *"
                                type="email"
                                placeholder="Your Email"
                                name="email"
                                onChange={(e) => onChange(e)}
                                required
                            />
                        </div>
                        <div className="w-full max-w-sm min-w-[200px]">
                            <Input
                                label="Password *"
                                type="password"
                                placeholder="******"
                                name="password"
                                onChange={(e) => onChange(e)}
                                required
                            />
                            <p className='text-sm mt-1 text-gray-600'>Password must be at least 6 characters long</p>
                        </div>
                    </div>

                    <button onClick={() => handleSubmit()} className="mt-4 w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                        Sign Up
                    </button>
                </div>
                <p className="flex justify-center mt-6 text-sm text-slate-600">
                    Already have a account?
                    <Link to="/login" className="ml-1 text-sm font-semibold text-slate-700 underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Signup