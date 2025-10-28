// src/pages/Profile.jsx
const Profile = ({ user }) => {
  return (
    <div className="container mx-auto px-6 py-16">
      <h2 className="text-2xl font-semibold mb-6">Profile</h2>
      <div className="bg-white p-6 rounded shadow max-w-md">
        <p><strong>Name:</strong> {user?.name}</p>
        <p className="mt-2"><strong>Email:</strong> {user?.email}</p>
      </div>
    </div>
  );
};

export default Profile;
