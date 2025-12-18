import { Routes, Route, Navigate } from "react-router-dom";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
