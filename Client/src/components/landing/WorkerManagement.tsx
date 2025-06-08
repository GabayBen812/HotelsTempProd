import { useTranslation } from "react-i18next";
import {
  Smartphone,
  MessageCircle,
  ClipboardList,
  Users,
  Bot,
  ArrowRight,
} from "lucide-react";

export default function WorkerManagement() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            {t("landing.worker_management.empower_your_staff")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("landing.worker_management.empower_your_staff_description")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Mobile App Features */}
          <div className="relative">
            <div className="bg-blue-600 rounded-3xl p-8 text-white">
              <Smartphone className="w-12 h-12 mb-6" />
              <h3 className="text-2xl font-bold mb-4">
                {t("landing.worker_management.mobile_app")}
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                  {t("landing.worker_management.real_time_task_notifications")}
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                  {t(
                    "landing.worker_management.easy_task_acceptance_and_updates"
                  )}
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                  {t("landing.worker_management.location_based_assignments")}
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                  {t("landing.worker_management.offline_mode_support")}
                </li>
              </ul>
            </div>
          </div>

          {/* Management Features */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <MessageCircle className="w-10 h-10 text-blue-600 mb-4" />
              <h4 className="text-xl font-semibold mb-3">
                {t("landing.worker_management.team_chat")}
              </h4>
              <p className="text-gray-600">
                {t("landing.worker_management.team_chat_description")}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <ClipboardList className="w-10 h-10 text-blue-600 mb-4" />
              <h4 className="text-xl font-semibold mb-3">Task Management</h4>
              <p className="text-gray-600">
                {t("landing.worker_management.create_assign_track_tasks")}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Users className="w-10 h-10 text-blue-600 mb-4" />
              <h4 className="text-xl font-semibold mb-3">Staff Scheduling</h4>
              <p className="text-gray-600">
                {t("landing.worker_management.intelligent_scheduling_system")}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Bot className="w-10 h-10 text-blue-600 mb-4" />
              <h4 className="text-xl font-semibold mb-3">AI Assistance</h4>
              <p className="text-gray-600">
                {t(
                  "landing.worker_management.smart_suggestions_for_task_assignment_and_workload_balancing"
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 text-blue-600 cursor-pointer group">
            <span className="font-semibold">
              {t("landing.worker_management.learn_more_about_our_mobile_app")}
            </span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </section>
  );
}
