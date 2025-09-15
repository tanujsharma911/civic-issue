// packages
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../../../store/authSlice'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'

// local imports
import Input from '../../Input'
import auth from '../../../supabase/auth'

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async () => {
        const res = await auth.login(formData.email, formData.password);

        if (res.status === 'success') {
            dispatch(login(res.user));
            toast.success('Logged in successfully!');
            navigate('/');
        } else {
            alert(res.msg);
        }
    }

    return (
        <>
            <div className="relative flex flex-col justify-center mt-10 rounded-xl bg-transparent">
                <h1 className="block text-4xl text-center font-semibold text-slate-900">
                    Login
                </h1>
                <div className="mt-8 mx-auto mb-2 w-sm" >
                    <div className="mb-1 flex flex-col gap-6">
                        <div className="w-full max-w-sm min-w-[200px]">
                            <Input
                                label="Email"
                                type="email"
                                placeholder="Your Email"
                                required
                                onChange={(e) => onChange(e)}
                                name="email"
                            />
                        </div>

                        <div className="w-full max-w-sm min-w-[200px]">
                            <Input
                                label="Password"
                                type="password"
                                placeholder="******"
                                required
                                onChange={(e) => onChange(e)}
                                name="password"
                            />
                        </div>
                    </div>

                    <button className="mt-4 w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" onClick={() => handleSubmit()} label="Login">
                        Login
                    </button>
                </div>
                <p className="flex justify-center mt-6 text-sm text-slate-600">
                    Don't have an account?
                    <Link to="/signup" className="ml-1 text-sm font-semibold text-slate-700 underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </>
    )
}

export default Login
