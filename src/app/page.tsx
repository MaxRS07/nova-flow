import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-white p-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Workflows
              </h2>
            </div>

            {/* Workflow Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sample Workflow Cards */}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500"></div>
                    <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-all">
                      •••
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Workflow {i}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Example workflow description
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Updated 2h ago</span>
                    <span className="px-2 py-1 rounded bg-blue-50 text-blue-600 font-medium">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl hover:shadow-md transition-all text-left group">
                <h3 className="font-semibold text-gray-900 mb-1">Import Workflow</h3>
                <p className="text-sm text-gray-600">Add existing workflows</p>
              </button>
              <button className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-100 rounded-xl hover:shadow-md transition-all text-left group">
                <h3 className="font-semibold text-gray-900 mb-1">Connect Agent</h3>
                <p className="text-sm text-gray-600">Integrate with Nova Act</p>
              </button>
              <button className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl hover:shadow-md transition-all text-left group">
                <h3 className="font-semibold text-gray-900 mb-1">Browse Templates</h3>
                <p className="text-sm text-gray-600">Start from examples</p>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
