import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Eye,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';

import { getEventLogs } from '../../api/eventLogApi';
import StatusBadge from '../../components/ui/StatusBadge';

const formatDate = (date) => {
  if (!date) {
    return '-';
  }

  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

const getStatusTone = (status) => {
  if (status === 'PROCESSED') {
    return 'green';
  }

  if (status === 'FAILED') {
    return 'red';
  }

  return 'slate';
};

const AdminEventLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [eventTypeFilter, setEventTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadLogs = async (targetPage = page) => {
    try {
      setIsLoading(true);
      setError('');

      const data = await getEventLogs({
        page: targetPage,
        limit: 20,
        eventType: eventTypeFilter || undefined,
        status: statusFilter || undefined,
      });

      setLogs(data.logs || []);
      setPage(data.page || 1);
      setPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message || 'Event log kayıtları alınamadı.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs(1);
  }, [eventTypeFilter, statusFilter]);

  const filteredLogs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return logs;
    }

    return logs.filter((log) => {
      const searchableText = `
        ${log.eventType}
        ${log.aggregateType}
        ${log.aggregateId}
        ${log.actor?.name || ''}
        ${log.actor?.email || ''}
        ${log.status}
        ${JSON.stringify(log.payload || {})}
      `.toLowerCase();

      return searchableText.includes(query);
    });
  }, [logs, searchTerm]);

  const handlePrevPage = () => {
    if (page > 1) {
      loadLogs(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < pages) {
      loadLogs(page + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-slate-500">
        Event log kayıtları yükleniyor...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-semibold text-blue-600">Admin Paneli</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Event Logları
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            RabbitMQ worker tarafından işlenen arka plan event kayıtlarını
            görüntüleyin.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadLogs(page)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
        >
          <RefreshCw size={17} />
          Yenile
        </button>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Toplam Event</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{total}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Sayfa</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {page} / {pages}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Async Sistem</p>
          <p className="mt-2 text-lg font-bold text-emerald-600">
            RabbitMQ + Worker
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Reçete eventleri arka planda işlenir.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Event Listesi</h2>
            <p className="mt-1 text-sm text-slate-500">
              Bu sayfada {filteredLogs.length} kayıt gösteriliyor.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row">
            <select
              value={eventTypeFilter}
              onChange={(event) => setEventTypeFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            >
              <option value="">Tüm Eventler</option>
              <option value="PRESCRIPTION_CREATED">
                PRESCRIPTION_CREATED
              </option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            >
              <option value="">Tüm Durumlar</option>
              <option value="PROCESSED">PROCESSED</option>
              <option value="FAILED">FAILED</option>
            </select>

            <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50">
              <Search size={18} className="text-slate-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Event ara..."
                className="w-full min-w-[220px] border-0 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {filteredLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Event</th>
                  <th className="px-5 py-3">Aggregate</th>
                  <th className="px-5 py-3">Actor</th>
                  <th className="px-5 py-3">Durum</th>
                  <th className="px-5 py-3">İşlenme</th>
                  <th className="px-5 py-3 text-right">Detay</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                          <Activity size={20} />
                        </div>

                        <div>
                          <p className="font-bold text-slate-900">
                            {log.eventType}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {log._id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-700">
                        {log.aggregateType}
                      </p>
                      <p className="mt-1 break-all text-xs text-slate-500">
                        {log.aggregateId}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-700">
                        {log.actor?.name || '-'}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {log.actor?.email || '-'}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge tone={getStatusTone(log.status)}>
                        {log.status}
                      </StatusBadge>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(log.processedAt)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setSelectedLog(log)}
                          className="inline-flex items-center gap-2 rounded-xl border border-blue-100 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50"
                        >
                          <Eye size={15} />
                          Detay
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between border-t border-slate-100 p-5">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={page <= 1}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft size={17} />
                Önceki
              </button>

              <p className="text-sm font-semibold text-slate-500">
                Sayfa {page} / {pages}
              </p>

              <button
                type="button"
                onClick={handleNextPage}
                disabled={page >= pages}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                Sonraki
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <ClipboardList size={24} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Event log bulunamadı
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Yeni reçete oluşturulduğunda worker event kaydı yazacaktır.
            </p>
          </div>
        )}
      </section>

      {selectedLog && (
        <section className="rounded-3xl border border-blue-100 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 p-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Event Detayı
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {selectedLog.eventType}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedLog(null)}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid gap-4 p-5 lg:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Event ID
              </p>
              <p className="mt-2 break-all text-sm font-semibold text-slate-700">
                {selectedLog._id}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Aggregate ID
              </p>
              <p className="mt-2 break-all text-sm font-semibold text-slate-700">
                {selectedLog.aggregateId}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 lg:col-span-2">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Payload
              </p>
              <pre className="mt-3 max-h-96 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">
                {JSON.stringify(selectedLog.payload, null, 2)}
              </pre>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminEventLogsPage;