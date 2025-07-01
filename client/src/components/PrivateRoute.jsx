import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children, allowedRoles }) {
  const { user, loading } = useSelector((state) => state.auth);

  // Show loading while fetching user (optional)
  if (loading) return <div className="text-center p-10">Loading...</div>;

  // If no user → redirect to login
  
  if (!user) return <Navigate to="/login" />;

  // If role not allowed → redirect to their dashboard
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} />;
  }

  return children;
}

export default PrivateRoute;