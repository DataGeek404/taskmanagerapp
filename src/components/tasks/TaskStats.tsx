
import React, { useMemo } from 'react';
import { Task } from '@/lib/supabase';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';

interface TaskStatsProps {
  tasks: Task[];
}

const COLORS = {
  pending: '#f97316',
  'in-progress': '#2563eb',
  completed: '#16a34a',
};

const STATUS_LABELS = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  completed: 'Completed',
};

const TaskStats: React.FC<TaskStatsProps> = ({ tasks }) => {
  const chartData = useMemo(() => {
    const statusCounts = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status,
      value: count,
      status,
      fill: COLORS[status as keyof typeof COLORS] || '#999999',
    }));
  }, [tasks]);

  const totalTasks = tasks.length;
  
  if (totalTasks === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task Statistics</CardTitle>
          <CardDescription>No tasks available to analyze</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <p>Add tasks to see statistics</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Task Status Distribution</CardTitle>
          <CardDescription>Overview of your tasks by status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[entry.status as keyof typeof COLORS] || '#999999'} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background border border-border p-2 rounded-md shadow-md">
                          <p className="font-medium">{data.name}</p>
                          <p>Count: {data.value}</p>
                          <p>Percentage: {((data.value / totalTasks) * 100).toFixed(1)}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task Count by Status</CardTitle>
          <CardDescription>Number of tasks in each category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ChartContainer
              config={{
                pending: {
                  theme: {
                    light: COLORS.pending,
                    dark: COLORS.pending,
                  },
                  label: "Pending"
                },
                "in-progress": {
                  theme: {
                    light: COLORS['in-progress'],
                    dark: COLORS['in-progress'],
                  },
                  label: "In Progress"
                },
                completed: {
                  theme: {
                    light: COLORS.completed,
                    dark: COLORS.completed,
                  },
                  label: "Completed"
                }
              }}
            >
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <ChartTooltipContent
                          active={active}
                          payload={payload}
                        />
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="value" 
                  name="Tasks" 
                  fill="#8884d8"
                  fillOpacity={0.8}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskStats;
