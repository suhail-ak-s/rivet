import { css } from "@emotion/react";
import { FC, MouseEvent } from "react";
import clsx from "clsx";
import { useContextMenu } from "../../hooks/useContextMenu";
import { useStableCallback } from "../../hooks/useStableCallback";
import Portal from "@atlaskit/portal";
import { DropdownItem } from "@atlaskit/dropdown-menu";
import { TrivetTestSuite } from "@ironclad/trivet";
import Tabs, { Tab, TabList, TabPanel } from "@atlaskit/tabs";
import { LoadingSpinner } from "../LoadingSpinner";

const styles = css`
min-height: 100%;
border-right: 1px solid var(--grey);

.test-suite-list {
  margin: 10px 0;
  width: 100%;
}

.test-suite-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 8px;
  margin-top: 8px;
  cursor: pointer;

  &:hover {
    background-color: var(--grey-darkish);
  }
}

.test-suite-item.selected {
  background-color: var(--primary);
  color: var(--grey-dark);

  &:hover {
    background-color: var(--primary-dark);
  }
}

.selected .spinner svg {
  color: var(--grey-dark);
}

.test-suite-status {
  width: 20px;
  margin-right: 4px;
}
`;

const contextMenuStyles = css`
  position: absolute;
  border: 1px solid var(--grey);
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
  background: var(--grey-dark);
  min-width: max-content;
`;

export type TestSuiteListProps = {
  testSuites: TrivetTestSuite[];
  selectedTestSuite: TrivetTestSuite | undefined;
  setSelectedTestSuite: (id: string) => void;
  createNewTestSuite: () => void;
  deleteTestSuite: (id: string) => void;
  runningTestSuiteId: string | undefined;
};

export const TestSuiteList: FC<TestSuiteListProps> = ({
  testSuites,
  setSelectedTestSuite,
  selectedTestSuite,
  createNewTestSuite,
  deleteTestSuite,
  runningTestSuiteId,
}) => {
  const { contextMenuRef, showContextMenu, contextMenuData, handleContextMenu } = useContextMenu();

  const handleSidebarContextMenu = useStableCallback((e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleContextMenu(e);
  });

  function handleNew() {
    createNewTestSuite();
  }

  function handleDelete(id: string | undefined) {
    id && deleteTestSuite(id);
  }

  const selectedTestSuiteIdForContextMenu = contextMenuData.data
    ? contextMenuData.data?.element.dataset.testsuiteid
    : undefined;

  return (
    <div css={styles} onContextMenu={handleSidebarContextMenu} data-contextmenutype="test-suite-list" ref={contextMenuRef}>
      <Tabs id="test-suite-tabs">
        <TabList>
          <Tab>Test Suites</Tab>
        </TabList>
        <TabPanel>
          <div className="test-suite-list">
            {testSuites.map((testSuite) => (
              <div
                key={testSuite.id}
                onClick={() => setSelectedTestSuite(testSuite.id)}
                className={clsx('test-suite-item', { selected: testSuite.id === selectedTestSuite?.id })}
                data-contextmenutype="test-suite-item"
                data-testsuiteid={testSuite.id}>
                <div className="test-suite-status spinner">
                  {runningTestSuiteId === testSuite.id && <LoadingSpinner />}
                </div>
                <div className="test-suite-name">
                  {testSuite.name ?? 'Untitled Test Suite'}
                </div>
              </div>
            ))}
          </div>
        </TabPanel>
      </Tabs>
      <Portal>
        {showContextMenu && contextMenuData.data?.type === 'test-suite-list' && (
          <div
            css={contextMenuStyles}
            className="test-suite-list-context-menu"
            style={{
              zIndex: 500,
              left: contextMenuData.x,
              top: contextMenuData.y,
            }}
          >
            <DropdownItem onClick={handleNew}>New Test Suite</DropdownItem>
          </div>
        )}
        {showContextMenu && contextMenuData.data?.type === 'test-suite-item' && (
          <div
            css={contextMenuStyles}
            className="test-suite-list-context-menu"
            style={{
              zIndex: 500,
              left: contextMenuData.x,
              top: contextMenuData.y,
            }}
          >
            <DropdownItem onClick={() => handleDelete(selectedTestSuiteIdForContextMenu)}>Delete</DropdownItem>
          </div>
        )}
      </Portal>
    </div>
  );
};