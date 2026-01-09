import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, Trash2, Clock } from 'lucide-react';
import {
  getNotifications,
  saveNotifications,
  Notification,
} from '@/lib/mockData';
import { formatDistanceToNow } from 'date-fns';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const loadNotifications = () => {
    const allNotifications = getNotifications()
      .filter(n => n.userId === user?.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setNotifications(allNotifications);
  };

  const markAsRead = (notification: Notification) => {
    const allNotifications = getNotifications();
    const index = allNotifications.findIndex(n => n.id === notification.id);
    if (index !== -1) {
      allNotifications[index].read = true;
      saveNotifications(allNotifications);
      loadNotifications();
    }
  };

  const markAllAsRead = () => {
    const allNotifications = getNotifications();
    allNotifications.forEach(n => {
      if (n.userId === user?.id) {
        n.read = true;
      }
    });
    saveNotifications(allNotifications);
    loadNotifications();
  };

  const deleteNotification = (notification: Notification) => {
    const allNotifications = getNotifications();
    const filtered = allNotifications.filter(n => n.id !== notification.id);
    saveNotifications(filtered);
    loadNotifications();
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'connection_request':
        return '🤝';
      case 'payment_proof':
        return '🖼️';
      case 'payment_approved':
        return '✅';
      case 'payment_overdue':
        return '⚠️';
      case 'reminder':
        return '⏰';
      default:
        return '📢';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="w-6 h-6" />
          Notifications
          {unreadCount > 0 && (
            <Badge>{unreadCount}</Badge>
          )}
        </h1>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <Check className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No notifications yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-colors ${
                !notification.read ? 'bg-accent/50 border-primary/20' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification)}
                        >
                          <Trash2 className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
