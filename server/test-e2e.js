import { io } from 'socket.io-client';

const API_URL = 'http://localhost:5001/api';
const SOCKET_URL = 'http://localhost:5001';

async function runE2ETests() {
  console.log('🧪 Starting Backto Nostalgia Full-Stack E2E Test Suite...\n');

  // Test 1: Register User 1
  console.log('1️⃣ Registering Real User 1 (Utkarsh)...');
  const user1Data = {
    username: 'Utkarsh_' + Date.now().toString().slice(-4),
    email: `utkarsh_${Date.now()}@nostalgia.com`,
    password: 'password123',
    eraPreference: '2000s',
    bio: 'Time traveler & retro gaming speedrunner!',
  };
  const reg1Res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user1Data),
  });
  const reg1Json = await reg1Res.json();
  if (!reg1Json.success) throw new Error('User 1 register failed: ' + reg1Json.message);
  const token1 = reg1Json.token;
  const user1 = reg1Json.user;
  console.log(`   ✅ User 1 registered: ${user1.username} (ID: ${user1._id})\n`);

  // Test 2: Register User 2
  console.log('2️⃣ Registering Real User 2 (Priya)...');
  const user2Data = {
    username: 'Priya_' + Date.now().toString().slice(-4),
    email: `priya_${Date.now()}@nostalgia.com`,
    password: 'password123',
    eraPreference: '2000s',
    bio: 'Cartoon Network 5 PM enthusiast ❤️',
  };
  const reg2Res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user2Data),
  });
  const reg2Json = await reg2Res.json();
  if (!reg2Json.success) throw new Error('User 2 register failed: ' + reg2Json.message);
  const token2 = reg2Json.token;
  const user2 = reg2Json.user;
  console.log(`   ✅ User 2 registered: ${user2.username} (ID: ${user2._id})\n`);

  // Test 3: User 1 creates a post
  console.log('3️⃣ User 1 creating a new nostalgia memory post...');
  const postRes = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token1}`,
    },
    body: JSON.stringify({
      title: 'Contra with 30 Lives Cheat Code on 8-bit Cassette',
      story: 'Up Up Down Down Left Right Left Right B A Start! Playing with my brother on a Sunday morning.',
      category: 'Games',
      era: '90s',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    }),
  });
  const postJson = await postRes.json();
  if (!postJson.success) throw new Error('Create post failed: ' + postJson.message);
  const createdPost = postJson.post;
  console.log(`   ✅ Post created: "${createdPost.title}" (ID: ${createdPost._id})\n`);

  // Test 4: User 2 likes User 1's post
  console.log('4️⃣ User 2 liking the post...');
  const likeRes = await fetch(`${API_URL}/posts/${createdPost._id}/like`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token2}` },
  });
  const likeJson = await likeRes.json();
  if (!likeJson.success || !likeJson.isLiked) throw new Error('Like failed: ' + JSON.stringify(likeJson));
  console.log(`   ✅ Post liked! Likes count: ${likeJson.likesCount}\n`);

  // Test 5: User 2 saves post to Time Capsule
  console.log('5️⃣ User 2 saving post to Time Capsule...');
  const saveRes = await fetch(`${API_URL}/posts/${createdPost._id}/save`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token2}` },
  });
  const saveJson = await saveRes.json();
  if (!saveJson.success || !saveJson.isSaved) throw new Error('Save failed: ' + JSON.stringify(saveJson));
  console.log(`   ✅ Post saved to Time Capsule! Saved count: ${saveJson.savedPostsCount}\n`);

  // Test 6: User 2 comments on post
  console.log('6️⃣ User 2 commenting on post...');
  const commentRes = await fetch(`${API_URL}/posts/${createdPost._id}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token2}`,
    },
    body: JSON.stringify({ text: 'The Konami code is timeless! Remember blowing on the cassette cartridge too!' }),
  });
  const commentJson = await commentRes.json();
  if (!commentJson.success) throw new Error('Comment failed: ' + commentJson.message);
  console.log(`   ✅ Comment added: "${commentJson.comment.text}" by ${commentJson.comment.author.username}\n`);

  // Test 7: Verify User 2's Time Capsule
  console.log('7️⃣ Verifying User 2 Time Capsule endpoint (/api/capsule)...');
  const capsuleRes = await fetch(`${API_URL}/capsule`, {
    headers: { Authorization: `Bearer ${token2}` },
  });
  const capsuleJson = await capsuleRes.json();
  if (!capsuleJson.success || capsuleJson.savedPosts.length === 0) {
    throw new Error('Capsule verification failed');
  }
  console.log(`   ✅ Time Capsule verified: ${capsuleJson.savedPosts.length} saved memories, 90s count: ${capsuleJson.eraBreakdown['90s']}\n`);

  // Test 8: Real-Time Socket.IO Chat between 2 live users
  console.log('8️⃣ Testing Real-Time Socket.IO Chat between 2 live users...');
  const commsRes = await fetch(`${API_URL}/communities`);
  const commsJson = await commsRes.json();
  const testCommunity = commsJson.communities[0];

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Socket.IO test timed out after 8s'));
    }, 8000);

    const socket1 = io(SOCKET_URL, { transports: ['websocket'] });
    const socket2 = io(SOCKET_URL, { transports: ['websocket'] });

    let user2Received = false;

    socket1.on('connect', () => {
      console.log('   📡 Socket 1 (Utkarsh) connected:', socket1.id);
      socket1.emit('join-community', {
        communityId: testCommunity._id,
        channel: 'general',
        user: user1,
      });
    });

    socket2.on('connect', () => {
      console.log('   📡 Socket 2 (Priya) connected:', socket2.id);
      socket2.emit('join-community', {
        communityId: testCommunity._id,
        channel: 'general',
        user: user2,
      });

      // User 2 listens for incoming messages
      socket2.on('receive-message', (incomingMsg) => {
        console.log(`   💬 User 2 received live message from ${incomingMsg.sender?.username}: "${incomingMsg.text}"`);
        user2Received = true;
        clearTimeout(timeout);
        socket1.disconnect();
        socket2.disconnect();
        resolve();
      });

      // User 1 sends message after small delay for join handshake
      setTimeout(() => {
        console.log('   📤 User 1 sending message: "Anyone remember coming home at 4 PM for Doraemon?"');
        socket1.emit('send-message', {
          communityId: testCommunity._id,
          channel: 'general',
          text: 'Anyone remember coming home at 4 PM for Doraemon?',
          senderId: user1._id,
        });
      }, 500);
    });
  });

  console.log('\n🎉 ALL 8 E2E INTEGRATION & REAL-TIME SOCKET.IO TESTS PASSED FLAWLESSLY! 🚀✨\n');
}

runE2ETests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
