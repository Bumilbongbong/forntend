import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header';
import { fetchPublicBoard, searchPublicBoard, type DateFilter, type TagFilter } from '../../services/publicBoard';
import type { PublicBoardItem } from '../../types/board/PublicBoard';
import './PublicBoard.css';

const tagNames: { [key in TagFilter]: string } = {
  IN_PROGRESS: '진행중',
  ADOPT: '채택됨',
  REJECT: '반려',
  END: '종료',
};

export default function PublicBoard() {
  const navigate = useNavigate();
  const [boardItems, setBoardItems] = useState<PublicBoardItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [datefilter, setDatefilter] = useState<DateFilter>('RECENT');
  const [tag, setTag] = useState<TagFilter | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    // 태그 검증: ADOPT, REJECT만 허용
    if (tag && tag !== 'ADOPT' && tag !== 'REJECT') {
      setError('필터링은 채택 또는 반려만 선택할 수 있습니다.');
      setBoardItems([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const loadData = async () => {
      try {
        let data: PublicBoardItem[];
        if (searchQuery.trim()) {
          data = await searchPublicBoard(searchQuery.trim());
        } else {
          data = await fetchPublicBoard({ datefilter, tag: tag || undefined });
        }
        setBoardItems(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message);
        setBoardItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [datefilter, tag, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 검색은 useEffect에서 자동으로 처리됨
  };

  const getTagClassName = (tagValue: string, isBest: boolean) => {
    if (isBest) return 'tag-best';
    if (tagValue === 'ADOPT') return 'tag-adopt';
    if (tagValue === 'IN_PROGRESS') return 'tag-progress';
    if (tagValue === 'REJECT') return 'tag-reject';
    if (tagValue === 'END') return 'tag-end';
    return 'tag-progress';
  };

  return (
    <div>
      <Header />
      <div className="public-board-container">
        <div className="search-filter-section">
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              className="search-input"
              placeholder="문의 채널 검색하기"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </form>
          <div className="filter-wrapper" style={{ position: 'relative' }} ref={filterRef}>
            <button
              type="button"
              className="filter-button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <svg className="filter-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              필터링
            </button>
            {isFilterOpen && (
              <div className="filter-dropdown">
                <div className="filter-section">
                  <div className="filter-section-title">날짜</div>
                  <button
                    type="button"
                    className={`filter-option ${datefilter === 'RECENT' ? 'selected' : ''}`}
                    onClick={() => {
                      setDatefilter('RECENT');
                      setIsFilterOpen(false);
                    }}
                  >
                    최신순
                  </button>
                  <button
                    type="button"
                    className={`filter-option ${datefilter === 'OLDEST' ? 'selected' : ''}`}
                    onClick={() => {
                      setDatefilter('OLDEST');
                      setIsFilterOpen(false);
                    }}
                  >
                    오래된 순
                  </button>
                </div>
                <div className="filter-section">
                  <div className="filter-section-title">태그</div>
                  <button
                    type="button"
                    className={`filter-option ${tag === '' ? 'selected' : ''}`}
                    onClick={() => {
                      setTag('');
                      setIsFilterOpen(false);
                    }}
                  >
                    전체
                  </button>
                  <button
                    type="button"
                    className={`filter-option ${tag === 'ADOPT' ? 'selected' : ''}`}
                    onClick={() => {
                      setTag('ADOPT');
                      setIsFilterOpen(false);
                    }}
                  >
                    채택
                  </button>
                  <button
                    type="button"
                    className={`filter-option ${tag === 'REJECT' ? 'selected' : ''}`}
                    onClick={() => {
                      setTag('REJECT');
                      setIsFilterOpen(false);
                    }}
                  >
                    반려
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="loading">불러오는 중...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <ul className="board-list">
            {Array.isArray(boardItems) && boardItems.map(item => (
              <li key={item.chatRoomId} className="board-item">
                <div className="board-item-content">
                  <div className="board-item-header">
                    {item.best && <span className="tag-best">베스트 글</span>}
                    <span className={getTagClassName(item.tag, false)}>
                      {tagNames[item.tag as TagFilter] || item.tag}
                    </span>
                  </div>
                  <h3 className="board-title">{item.title}</h3>
                  <div className="board-meta">
                    <span>{item.author}</span>
                    <span>{(() => {
                      const date = new Date(item.createdAt);
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const day = String(date.getDate()).padStart(2, '0');
                      return `${year}.${month}.${day}`;
                    })()}</span>
                  </div>
                </div>
                <div className="board-reactions">
                  <span>👍 {item.likeCnt}</span>
                  <span>👎 {item.dislikeCnt}</span>
                </div>
              </li>
            ))}
            {Array.isArray(boardItems) && boardItems.length === 0 && (
              <li className="empty">표시할 글이 없습니다.</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
