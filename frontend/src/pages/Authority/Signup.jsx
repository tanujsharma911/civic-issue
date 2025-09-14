import { Link } from 'react-router'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import Input from '../../components/Input'
import auth from '../../supabase/auth'

function Signup() {
  const navigate = useNavigate();
  const [btnText, setBtnText] = useState('Sign Up');

  const [formData, setFormData] = useState({
    role: 'authority',
    state: '',
    city: '',
    email: '',
    password: ''
  });

  const [passkey, setPasskey] = useState('');

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async () => {
    setBtnText('Signing Up...')
    const updatedForm = { ...formData };

    // console.log(updatedForm)

    if (updatedForm.state.length < 3) {
      alert('Please enter state');
      return;
    }
    if (updatedForm.city.length < 3) {
      alert('Please enter city');
      return;
    }
    if (updatedForm.email.length < 3) {
      alert('Please enter email');
      return;
    }
    if (updatedForm.password.length < 3) {
      alert('Please enter password');
      return;
    }

    if (passkey !== '12345678') {
      alert('Wrong passkey');
      return;
    }

    setFormData(updatedForm);

    const res = await auth.authoritySignUp(formData.state, formData.city, formData.email, formData.password);

    if (res.status === 'success') {
      alert(res.msg);
      navigate('/authority/login');
      setBtnText('Signed Up!')
    } else {
      alert(res.msg);
      setBtnText('Sign Up')
    }
  }

  return (
    <div className='flex justify-center'>
      <div className="relative flex flex-col rounded-xl bg-transparent">
        <h1 className="block text-4xl text-center font-semibold text-slate-900">
          Authority Sign Up
        </h1>

        <div className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
          <div className="mb-1 flex flex-col gap-6">

            <div className="w-full max-w-sm min-w-[200px]">
              <Input
                label="State"
                type="text"
                placeholder="Your State"
                name="state"
                onChange={(e) => onChange(e)}
                required
              />
            </div>

            <div className="w-full max-w-sm min-w-[200px]">
              <Input
                label="City"
                type="text"
                placeholder="Your City"
                name="city"
                onChange={(e) => onChange(e)}
                required
              />
            </div>

            <div className="w-full max-w-sm min-w-[200px]">
              <Input
                label="Email"
                type="email"
                placeholder="Your Email"
                name="email"
                onChange={(e) => onChange(e)}
                required
              />
            </div>

            <div className="w-full max-w-sm min-w-[200px]">
              <Input
                label="Password"
                type="password"
                placeholder="******"
                name="password"
                onChange={(e) => onChange(e)}
                required
              />
            </div>

            <div className="w-full max-w-sm min-w-[200px]">
              <Input
                label="Passkey"
                type="password"
                placeholder="********"
                name="passkey"
                onChange={(e) => setPasskey(e.target.value)}
                required
              />
            </div>
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