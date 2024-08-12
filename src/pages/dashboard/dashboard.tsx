import React, { useState } from 'react';
import WordCloudChart from "@/pages/dashboard/components/wordCloudChart";
import SystemPanel from "@/pages/dashboard/components/systemPanel";

const Dashboard = () => {
    const [timeRange, setTimeRange] = useState({
        startTime: Date.now() - 7 * 86400000,
        endTime: Date.now(),
        limit: 10,
    });

    return (
        <div>
            <WordCloudChart timeRange={timeRange} setTimeRange={setTimeRange} />
            <SystemPanel />
        </div>
    );
};

export default Dashboard;
