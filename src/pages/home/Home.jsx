import Feed from '../../components/feed/Feed';
import Pesquisa from '../../components/pesquisa/Pesquisa';
import PostForm from '../../components/Postform/Postform';
import Layout from '../../components/layout/Layout';
import Post from '../../components/post/Post';
import Sidebar from '../../components/sidebar/Sidebar';
import Righbar from '../../components/rightbar/Righbar';

export default function Home() {
  return (
    <div className="home-page">
      <Pesquisa />
      <PostForm />
      <Post />
      <Feed />
      <Layout />
      <Pesquisa />
      <Sidebar />
      <Righbar />
    </div>
  );
}