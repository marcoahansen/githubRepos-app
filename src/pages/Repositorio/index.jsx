import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Owner,
  Loading,
  Backbutton,
  IssuesList,
  PageActions,
  FilterButtons,
} from "./styles";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import api from "../../services/api";

export default function Repositorio() {
  const { repositorio } = useParams();

  const [repositorioDetalhes, setRepositorioDetalhes] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filtros, setFiltros] = useState([
    { state: "all", label: "Todas", active: true },
    { state: "open", label: "Abertas", active: false },
    { state: "closed", label: "Fechadas", active: false },
  ]);
  const [filtroIndex, setFiltroIndex] = useState(0);

  useEffect(() => {
    async function load() {
      const nomeRepo = decodeURIComponent(repositorio);

      const [repositorioData, issuesData] = await Promise.all([
        api.get(`/repos/${nomeRepo}`),
        api.get(`/repos/${nomeRepo}/issues`, {
          params: {
            state: filtros.find((f) => f.active).state,
            per_page: 5,
          },
        }),
      ]);

      setRepositorioDetalhes(repositorioData.data);
      setIssues(issuesData.data);
      setLoading(false);
    }
    console.log(issues);
    load();
  }, [filtros, repositorio]);

  useEffect(() => {
    async function loadIssue() {
      const nomeRepo = decodeURIComponent(repositorio);

      const response = await api.get(`/repos/${nomeRepo}/issues`, {
        params: {
          state: filtros[filtroIndex].state,
          page,
          per_page: 5,
        },
      });

      setIssues(response.data);
    }
    loadIssue();
  }, [page, filtros, filtroIndex]);

  function handlePage(action) {
    setPage(action === "voltar" ? page - 1 : page + 1);
  }

  function handleFilter(index) {
    setFiltroIndex(index);
  }

  if (loading) {
    return (
      <Loading>
        <h1>Carregando...</h1>
      </Loading>
    );
  }

  return (
    <Container>
      <Backbutton to="/">
        <FaArrowLeft color="#0d2636" size={30} />
      </Backbutton>
      <Owner>
        <img
          src={repositorioDetalhes.owner.avatar_url}
          alt={repositorioDetalhes.owner.login}
        />
        <h1>{repositorioDetalhes.name}</h1>
        <p>{repositorioDetalhes.description}</p>
      </Owner>
      <IssuesList>
        <div className="filtros">
          <h3>Issues</h3>
          <FilterButtons active={filtroIndex}>
            {filtros.map((filtro, index) => (
              <button
                key={filtro.label}
                type="button"
                onClick={() => handleFilter(index)}
              >
                {filtro.label}
              </button>
            ))}
          </FilterButtons>
        </div>
        {issues.map((issue) => (
          <li key={String(issue.id)}>
            <img src={issue.user.avatar_url} alt={issue.user.login} />
            <div>
              <strong>
                <a href={issue.html_url}>{issue.title}</a>
                <div className="labels">
                  {issue.labels.map((label) => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </div>
              </strong>
              <p>{issue.user.login}</p>
            </div>
          </li>
        ))}
      </IssuesList>
      <PageActions>
        <button
          disabled={page < 2}
          type="button"
          onClick={() => handlePage("voltar")}
        >
          <FaArrowLeft color="#FFF" scale={20} />
        </button>
        <button type="button" onClick={() => handlePage("ir")}>
          <FaArrowRight color="#FFF" scale={20} />
        </button>
      </PageActions>
    </Container>
  );
}
