import { Link } from 'react-router'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import Input from '../../Input'
import { login } from '../../../store/authSlice'
import auth from '../../../supabase/auth'

function Signup() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [btnText, setBtnText] = useState('Send OTP');

    const [formData, setFormData] = useState({
        role: 'officer',
        name: 'annoymous',
        state: '',
        lgd_ward_code: '',
        workDoneStatus: 'Not Assigned',
        city: '',
        otp: '',
        phone: ''
    });

    const sendOtp = async () => {
        const { error } = await auth.sendOtp(formData.name, formData.phone, formData.lgd_ward_code);

        if (error) {
            console.log(error);
            return false;
        }

        return true;
    }

    const handleSubmit = async () => {
        if (formData.phone.length !== 10) {
            alert('Please enter a valid phone number');
            return false;
        }
        if (formData.name.length < 3) {
            alert('Please enter a valid name');
            return false;
        }
        if (formData.state.length < 3) {
            alert('Please enter a valid state');
            return false;
        }
        if (formData.city.length < 3) {
            alert('Please enter a valid city');
            return false;
        }

        if (btnText === 'Send OTP') {

            const isValid = await sendOtp();
            if (!isValid) return;

            setBtnText('Verify OTP');
            return;
        }

        const response = await auth.verifyOtp(formData);

        if (response.status === 'error') {
            console.log(response.msg);
            return;
        }

        dispatch(login(response.session.user));
        navigate('/');
    }

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    return (
        <div className='flex justify-center'>
            <div className="relative flex flex-col rounded-xl bg-transparent">
                <h1 className="block text-4xl text-center font-semibold text-slate-900">
                    Ward Member Sign Up
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
                                label="Your City"
                                type="text"
                                placeholder="Example: Udaipur"
                                name="city"
                                onChange={(e) => onChange(e)}
                                required
                            />
                        </div>
                        <div className="w-full max-w-sm min-w-[200px]">
                            <Input
                                label="Your State"
                                type="text"
                                placeholder="Example: Rajasthan"
                                name="state"
                                onChange={(e) => onChange(e)}
                                required
                            />
                        </div>
                        <div className="w-full max-w-sm min-w-[200px]">
                            <Input
                                label="Your Ward Number"
                                type="text"
                                placeholder="Example: 12"
                                name="lgd_ward_code"
                                onChange={(e) => onChange(e)}
                                required
                            />
                        </div>
                        <div className="w-full max-w-sm min-w-[200px]">
                            <Input
                                label="Phone Number"
                                type="number"
                                placeholder="945xxxxxxx"
                                name="phone"
                                onChange={(e) => onChange(e)}
                                required
                            />
                        </div>
                        {btnText === 'Verify OTP' &&
                            <div className="w-full max-w-sm min-w-[200px]">
                                <Input
                                    label="OTP"
                                    type="text"
                                    placeholder="123456"
                                    name="otp"
                                    onChange={(e) => onChange(e)}
                                    required
                                />
                            </div>}
                    </div>

                    <button onClick={() => handleSubmit()} className="mt-4 w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                        {btnText}
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