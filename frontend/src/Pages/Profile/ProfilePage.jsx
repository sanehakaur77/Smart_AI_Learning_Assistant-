import React, { useState, useEffect } from "react";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import authService from "../../services/authService";
import toast from "react-hot-toast";
import { User, Mail, Lock } from "lucide-react";

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const fetchProfile = async () => {
    try {
      const { data } = await authService.getProfile();
      setUsername(data.username);
      setEmail(data.email);
      console.log(data)
    } catch (error) {
      toast.error("Failed to fetch profile data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    setPasswordLoading(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      toast.error(error.message || "Failed to change password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 1. Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* 2. Right Side Wrapper */}
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
        {/* 3. Header inside the wrapper so it respects the margin */}
        <Header toggleSidebar={toggleSidebar} />

        {/* 4. Content Area */}
        <main className="p-4 md:p-8 pt-20 md:pt-24 max-w-4xl mx-auto w-full">
          <PageHeader title="Profile Settings" />

          {/* Changed grid-cols-2 to flex-col and reduced max-width for better vertical readability */}
          <div className="flex flex-col gap-8 mt-8">
            {/* User Information Card */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                User Information
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Username
                  </label>
                  <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 font-medium">
                      Saneha
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Email
                  </label>
                  <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 font-medium">{email}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Change Password Card */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                Change Password
              </h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                {/* ... (Keep your existing form inputs here) ... */}
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full bg-[#10B981] hover:bg-[#0da372] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-emerald-100 transition-all mt-2"
                >
                  {passwordLoading ? "Changing..." : "Change Password"}
                </Button>
              </form>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
