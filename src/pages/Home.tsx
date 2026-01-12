import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import { useAuth } from '../contexts/AuthContext';
import characterImg from '../assets/images/character.png';
import boardImg from '../assets/images/board.png';
import userImg from '../assets/images/user.png';

export default function Home() {
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin, userName } = useAuth();

  const showLoginGuard = () => {
    alert('로그인이 필요한 서비스입니다.');
    navigate('/login');
  };

  // 비로그인 상태
  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', background: '#fafafa' }}>
        <Header />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '90vh',
            gap: 60,
          }}
        >
          {/* 1:1 채팅 문의 */}
          <div
            style={{
              border: '1px solid #eee',
              borderRadius: 24,
              background: '#fff',
              width: 360,
              height: 400,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px #0001',
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 12 }}>
              1:1 채팅 문의
            </div>
            <img src={characterImg} style={{ width: 120, marginBottom: 24 }} />
            <button
              style={{
                color: '#288279',
                border: 'none',
                background: 'none',
                fontSize: 17,
                fontWeight: 500,
                cursor: 'pointer',
                marginTop: 12,
              }}
              onClick={showLoginGuard}
            >
              채팅방 생성하기 →
            </button>
          </div>

          {/* 게시판 */}
          <div
            style={{
              border: '1px solid #eee',
              borderRadius: 24,
              background: '#fff',
              width: 360,
              height: 400,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px #0001',
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 12 }}>
              게시판
            </div>
            <img src={boardImg} style={{ width: 120, marginBottom: 24 }} />
            <button
              style={{
                color: '#288279',
                border: 'none',
                background: 'none',
                fontSize: 17,
                fontWeight: 500,
                cursor: 'pointer',
                marginTop: 12,
              }}
              onClick={showLoginGuard}
            >
              게시판 둘러보기 →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 로그인 상태
  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <Header isLoggedIn={true} isAdmin={isAdmin} userName={userName} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '90vh',
          gap: 60,
          flexWrap: 'wrap',
        }}
      >
        {/* 1:1 문의 (🔥 여기만 수정됨) */}
        <div
          style={{
            border: '1px solid #eee',
            borderRadius: 24,
            background: '#fff',
            width: 360,
            height: 400,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px #0001',
          }}
        >
          <div style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 12 }}>
            1:1 문의
          </div>
          <img src={characterImg} style={{ width: 120, marginBottom: 24 }} />
          <button
            style={{
              color: '#288279',
              border: 'none',
              background: 'none',
              fontSize: 17,
              fontWeight: 500,
              cursor: 'pointer',
              marginTop: 12,
            }}
            onClick={() => navigate('/chat')}
          >
            조회하기 →
          </button>
        </div>

        {/* 게시판 (그대로) */}
        <div
          style={{
            border: '1px solid #eee',
            borderRadius: 24,
            background: '#fff',
            width: 360,
            height: 400,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px #0001',
          }}
        >
          <div style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 12 }}>
            게시판
          </div>
          <img src={boardImg} style={{ width: 120, marginBottom: 24 }} />
          <button
            style={{
              color: '#288279',
              border: 'none',
              background: 'none',
              fontSize: 17,
              fontWeight: 500,
              cursor: 'pointer',
              marginTop: 12,
            }}
            onClick={() =>
              isAdmin ? navigate('/admin/chats') : navigate('/boards/public')
            }
          >
            {isAdmin ? '조회하기' : '게시판 둘러보기'} →
          </button>
        </div>

        {/* 관리자만: 학생 정보 (그대로) */}
        {isAdmin && (
          <div
            style={{
              border: '1px solid #eee',
              borderRadius: 24,
              background: '#fff',
              width: 360,
              height: 400,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px #0001',
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 12 }}>
              학생 정보
            </div>
            <img src={userImg} style={{ width: 80, marginBottom: 34 }} />
            <button
              style={{
                color: '#288279',
                border: 'none',
                background: 'none',
                fontSize: 17,
                fontWeight: 500,
                cursor: 'pointer',
                marginTop: 16,
              }}
              onClick={() => navigate('/students')}
            >
              조회하기 →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
